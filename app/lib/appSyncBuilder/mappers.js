const genericResponseMapper = '$utils.toJson($context.result)'

const lambdaRequestMapper = options => `{
  "version": "2017-02-28",
  "operation": "Invoke",
  "payload": {
    "args":  $utils.toJson($context.arguments),
    "headers": $utils.toJson($context.request.headers),
    "parent": $utils.toJson($context.source),
    "resolver": "${options.operationName}",
    "type": "${options.operationType}",
    "directives": ${JSON.stringify(options.directives)},
  }
}`

const requestMapperFileName = ({ operationType, operationName }) => `${operationType}.${operationName}.request.autogen.txt`
const responseMapperFileName = ({ operationType, operationName }) => `${operationType}.${operationName}.response.autogen.txt`
const mapperInfo = (fileName, content) => ({ fileName, content })

const requestMapper = (resolver, content) => {
  const requestMapperContent = content || lambdaRequestMapper(resolver)
  return mapperInfo(requestMapperFileName(resolver), requestMapperContent)
}

const responseMapper = (resolver, content) => {
  const responseMapperContent = content || genericResponseMapper
  return mapperInfo(responseMapperFileName(resolver), responseMapperContent)
}

const serverlessDataSource = (resolver, customSource) => {
  const dataSource = customSource || 'GraphqlHandler'
  return `
  - dataSource: ${dataSource}
    type: ${resolver.operationType}
    field: ${resolver.operationName}
    request: ${requestMapperFileName(resolver)}
    response: ${responseMapperFileName(resolver)}
  `
}

const createDefaultMappersAndDatasource = resolver => ({
  operationName: resolver.operationName,
  requestMapper: requestMapper(resolver),
  responseMapper: responseMapper(resolver),
  dataSource: serverlessDataSource(resolver),
})

module.exports = {
  createDefaultMappersAndDatasource,
  lambdaRequestMapper,
  mapperInfo,
  requestMapper,
  requestMapperFileName,
  responseMapper,
  responseMapperFileName,
  serverlessDataSource,
}
