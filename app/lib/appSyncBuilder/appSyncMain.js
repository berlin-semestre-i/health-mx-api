const fs = require('fs')
const path = require('path')

const logger = require('../logger')
const { createGlobalSchema, createMappingTemplates } = require('./appSyncBuilder')

const buildAbsolutePath = (...paths) => path.join(__dirname, ...paths)
const mapperSuccesMessage = filename => `Mapping template ${filename} was successfully created`

const writeMapperTemplates = (mappers) => {
  mappers.forEach(({ dataSource, requestMapper, responseMapper }) => {
    const mappingTemplatesPath = '../../mapping-templates/'
    const serverlessPath = '../../../serverless/'

    const { fileName: requestFileName, content: requestContent } = requestMapper
    let filePath = buildAbsolutePath(mappingTemplatesPath, requestFileName)
    fs.writeFileSync(filePath, requestContent)
    logger.info(mapperSuccesMessage(requestFileName))

    const { fileName: responseFileName, content: responseContent } = responseMapper
    filePath = buildAbsolutePath(mappingTemplatesPath, responseFileName)
    fs.writeFileSync(filePath, responseContent)
    logger.info(mapperSuccesMessage(responseFileName))

    filePath = buildAbsolutePath(serverlessPath, 'mapping.autogen.yml')
    fs.appendFileSync(filePath, dataSource)
  })
}

const main = async () => {
  const APIPath = '../../API/'
  const globalSchemaFile = buildAbsolutePath('../../global.schema.autogen.graphql')
  const globalSchema = createGlobalSchema(APIPath)
  fs.writeFileSync(globalSchemaFile, globalSchema)
  logger.info('Global Schema was successfully created')

  const mappers = await createMappingTemplates(APIPath, globalSchema)
  writeMapperTemplates(mappers)
  logger.info('File mapping.autogen.yml was successfully created')
  logger.info('AppSync builder has finished')

  process.exit(0)
}

main().catch((error) => {
  logger.error(error)
  process.exit(1)
})
