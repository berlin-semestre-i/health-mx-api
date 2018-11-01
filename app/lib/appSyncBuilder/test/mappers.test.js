const {
  lambdaRequestMapper,
  mapperInfo,
  requestMapper,
  requestMapperFileName,
  responseMapper,
  responseMapperFileName,
} = require('../mappers')

describe('RequestMapper', () => {
  const operationName = 'getAllContent'
  const operationType = 'Mutation'
  const fakeResolver = { operationType, operationName }

  it('should return the lambda mapper when no specific content is passed', () => {
    const expectedMapper = mapperInfo(
      requestMapperFileName(fakeResolver),
      lambdaRequestMapper(fakeResolver),
    )
    expect(requestMapper(fakeResolver)).toEqual(expectedMapper)
  })

  it('should return the specific content provided in the parameters', () => {
    const fakeMapperContent = 'This is just for testing purposes'
    const expectedMapper = mapperInfo(
      requestMapperFileName(fakeResolver),
      fakeMapperContent,
    )
    expect(requestMapper(fakeResolver, fakeMapperContent)).toEqual(expectedMapper)
  })
})

describe('ResponseMapper', () => {
  const operationName = 'getAllContent'
  const operationType = 'Query'
  const fakeResolver = { operationType, operationName }

  it('should return the generic response mapper when no specific content is passed', () => {
    const expectedMapper = mapperInfo(
      responseMapperFileName(fakeResolver),
      '$utils.toJson($context.result)',
    )
    expect(responseMapper(fakeResolver)).toEqual(expectedMapper)
  })

  it('should return the specific content provided in the parameters', () => {
    const fakeMapperContent = 'This is just for testing purposes'
    const expectedMapper = mapperInfo(
      responseMapperFileName(fakeResolver),
      fakeMapperContent,
    )
    expect(responseMapper(fakeResolver, fakeMapperContent)).toEqual(expectedMapper)
  })
})
