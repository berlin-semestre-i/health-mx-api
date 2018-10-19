/* eslint no-param-reassign:
    ["error", { "props": true, "ignorePropertyModificationsFor": ["mappers"] }] */
const fs = require('fs')
const path = require('path')
const readdirp = require('readdirp')
const { fileLoader, mergeResolvers, mergeTypes } = require('merge-graphql-schemas')
const { transpileSchema, getSchemaAST } = require('graphql-s2s').graphqls2s

const logger = require('../logger')
const {
  createDefaultMappersAndDatasource,
  requestMapper,
  responseMapper,
  serverlessDataSource,
} = require('./mappers')


const dataSourceRegex = /## \[DataSource:(\w+)] \*\*/g

const createGlobalSchema = (folderPath) => {
  const schemasPath = path.join(__dirname, folderPath, '/**/*.graphql')
  const typesArray = fileLoader(schemasPath)

  if (typesArray.length <= 0) {
    throw Error(`No schema files found under ${schemasPath}`)
  }

  const transpiledTypesArray = typesArray.map(transpileSchema)
  return mergeTypes(transpiledTypesArray, { all: true })
}

const getMergedResolvers = (folderPath) => {
  const resolversArray = [
    ...fileLoader(path.join(__dirname, folderPath, '/**/*.query.js')),
    ...fileLoader(path.join(__dirname, folderPath, '/**/*.mutation.js')),
  ]
  return mergeResolvers(resolversArray)
}

const getAllOperations = (folderPath, globalSchema) => {
  const schemasAST = getSchemaAST(globalSchema)

  const mergedResolvers = getMergedResolvers(folderPath)
  const operations = []

  Object.keys(mergedResolvers).forEach((operation) => {
    try {
      const props = schemasAST
        .find(schema => schema.name === operation)
        .blockProps
        .map(query => ({ name: query.details.name, type: operation }))
      operations.push(props)
    } catch (e) {
      logger.info(`No ${operation} operations found in global schema`)
    }
  })

  return operations
}

const getLambdaResolversList = (folderPath) => {
  const mergedResolvers = getMergedResolvers(folderPath)
  const resolversList = []

  Object.keys(mergedResolvers).forEach((operationType) => {
    if (Object.prototype.hasOwnProperty.call(mergedResolvers, operationType)) {
      Object.keys(mergedResolvers[operationType])
        .forEach((operationName) => {
          resolversList.push({ operationType, operationName })
        })
    }
  })

  return resolversList
}

const getOperationType = (operations, operationName) => {
  const graphqlOp = operations.find(operation => operation.name === operationName)
  if (graphqlOp) {
    return graphqlOp.type
  }
  throw Error(`The ${operationName} operation is not defined in the graphql schemas`)
}

const extractCustomDataSource = (userDefinedMapper) => {
  let customDataSource
  userDefinedMapper.replace(dataSourceRegex, (match, dataSource) => {
    customDataSource = dataSource
  })
  return customDataSource
}

const addToExistingMappers = ({ name, fullPath }, mappers = [], operations) => {
  const fileExtensions = /.request.txt|.response.txt/i
  const operationName = name.replace(fileExtensions, '')
  const mapperIndex = mappers.findIndex(mapper => mapper.operationName === operationName)
  const basicMapper = {
    operationName,
    responseMapper: responseMapper(operationName),
  }

  const userDefinedMapper = fs.readFileSync(fullPath, 'utf8')

  if (name.includes('.request.txt')) {
    const operationType = getOperationType(operations, operationName)
    const customDataSource = extractCustomDataSource(userDefinedMapper)

    if (!customDataSource) {
      throw Error(`No datasource defined in ${name} file.
          Place ## [DataSource:YourDataSource] ** in the top of the file to define it.`)
    }

    const mapperWithoutDataSource = userDefinedMapper.replace(dataSourceRegex, '')

    const resolver = { operationName, operationType }

    if (mapperIndex < 0) {
      const customMapper = basicMapper
      customMapper.requestMapper = requestMapper(resolver, mapperWithoutDataSource)
      customMapper.dataSource = serverlessDataSource(resolver, customDataSource)
      mappers.push(customMapper)
    } else {
      mappers[mapperIndex].requestMapper = requestMapper(resolver, mapperWithoutDataSource)
    }
  }

  if (name.includes('response.txt')) {
    if (mapperIndex < 0) {
      mappers.push(basicMapper)
    } else {
      mappers[mapperIndex].responseMapper = responseMapper(operationName, userDefinedMapper)
    }
  }
}

const createMappingTemplates = async (folderPath, globalSchema) => {
  const existingLambdaMappers = getLambdaResolversList(folderPath)
    .map(createDefaultMappersAndDatasource)
  const operations = getAllOperations(folderPath, globalSchema)
  const fileFilter = ['*.request.txt', '*.response.txt']
  const root = path.join(__dirname, folderPath)
  const recursiveDirExploration = new Promise((resolve, reject) => {
    readdirp({ root, fileFilter })
      .on('data', entry => addToExistingMappers(entry, existingLambdaMappers, operations))
      .on('error', reject)
      .on('end', resolve)
  })

  await recursiveDirExploration

  const missingResolver = existingLambdaMappers.find(file => !file.dataSource)
  if (missingResolver) {
    throw Error(`Resolver missing for ${missingResolver.operationName} operation`)
  }

  return existingLambdaMappers
}

module.exports = {
  createGlobalSchema,
  createMappingTemplates,
  getLambdaResolversList,
}
