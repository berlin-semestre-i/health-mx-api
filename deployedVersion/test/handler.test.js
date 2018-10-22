const fs = require('fs')
const HttpStatus = require('http-status-codes')
const { deployedVersionHandler } = require('../handler')

const REAL_FILE_PATH = './static/version.json'

describe('main Function', () => {
  beforeAll(async () => {
    if (fs.existsSync(REAL_FILE_PATH)) {
      fs.unlinkSync(REAL_FILE_PATH)
      fs.rmdirSync('./static')
    }
  })

  it('should return object with status 403 when no z-tracking-version header is found', async () => {
    expect.assertions(1)
    const event = {
      headers: {},
    }
    const result = await deployedVersionHandler(event)
    const expectedResult = {
      statusCode: HttpStatus.FORBIDDEN,
      headers: {},
      body: 'Missing authorization header',
    }
    expect(result).toEqual(expectedResult)
  })

  it('should return message explaining that environment does not have the version file', async () => {
    expect.assertions(1)
    const event = {
      headers: {
        'z-tracking-version': true,
      },
    }
    const result = await deployedVersionHandler(event)
    const expectedResult = {
      statusCode: HttpStatus.OK,
      headers: {},
      body: 'This environment does not have the version file',
    }
    expect(result).toEqual(expectedResult)
  })

  it('should return version.json object when file is found, and z-tracking-version header is found', async () => {
    expect.assertions(1)
    const event = {
      headers: { 'z-tracking-version': true },
    }
    const testJSON = '{ "test": "test succeed!" }'
    fs.mkdirSync('./static', { overwrite: false })
    fs.writeFileSync('./static/version.json', testJSON, { overwrite: true })
    const result = await deployedVersionHandler(event)
    fs.unlinkSync(REAL_FILE_PATH)
    fs.rmdirSync('./static')
    const expectedResult = {
      statusCode: HttpStatus.OK,
      headers: {},
      body: testJSON,
    }
    expect(result).toEqual(expectedResult)
  })
})
