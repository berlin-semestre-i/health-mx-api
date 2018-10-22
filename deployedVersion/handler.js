const fs = require('fs')
const HttpStatus = require('http-status-codes')

const FILE_PATH = './static/version.json'

const readVersionFile = (path) => {
  let content
  try {
    content = fs.readFileSync(path, 'UTF-8')
  } catch (e) {
    content = 'This environment does not have the version file'
  }
  return content
}

const response = (statusCode, body) => ({
  statusCode,
  headers: {},
  body,
})

module.exports.deployedVersionHandler = async (event) => {
  let statusCode
  let body
  if (!event.headers['z-tracking-version']) {
    statusCode = HttpStatus.FORBIDDEN
    body = 'Missing authorization header'
  } else {
    const content = readVersionFile(FILE_PATH)
    statusCode = HttpStatus.OK
    body = content
  }
  return response(statusCode, body)
}
