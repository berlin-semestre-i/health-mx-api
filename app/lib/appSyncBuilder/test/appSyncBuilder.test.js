const fs = require('fs')
const path = require('path')
const { getSchemaAST } = require('graphql-s2s').graphqls2s

const {
  createGlobalSchema,
  getLambdaResolversList,
} = require('../appSyncBuilder')

const getExpectedSchema = () => {
  const expectedGlobalSchemaFile = './__testFiles__/global.schema.test.graphql'
  const expectedSchema = fs.readFileSync(path.join(__dirname, expectedGlobalSchemaFile), 'utf8')
  return expectedSchema
}

describe('CreateGlobalSchema', () => {
  it('should generate a schema that contains all the schemas defined in separate files', () => {
    const globalSchema = createGlobalSchema('./test/__testFiles__/API')
    const expectedSchema = getExpectedSchema()
    expect(globalSchema).toBe(expectedSchema)
  })

  it('should throw an exception when no schema found to merge', () => {
    const globalSchemaFile = './test/__testFiles__/API/**/*.fakeSchemas.graphql'
    expect(() => createGlobalSchema(globalSchemaFile)).toThrow()
  })

  it('should throw an exception when not passing a valid folder path', () => {
    expect(() => createGlobalSchema('./folderThatNotExists')).toThrow()
  })
})

describe('GetResolversList', () => {
  const expectedSchema = getExpectedSchema()
  const schemasAST = getSchemaAST(expectedSchema)

  it('should return a list with the existing resolvers in the specified path', () => {
    const resolversList = getLambdaResolversList('./test/__testFiles__/API/', schemasAST)
    const expectedResolversList = [
      { operationName: 'getContentDefinition', operationType: 'Query', directives: ['authorize'] },
      { operationName: 'createContentDefinition', operationType: 'Mutation', directives: [] },
    ]
    expect(resolversList).toEqual(expectedResolversList)
  })

  it('should return an empty array when passing a not valid path', () => {
    const resolversList = getLambdaResolversList('./folderThatDoesNotExists', schemasAST)
    expect(resolversList).toEqual([])
  })
})
