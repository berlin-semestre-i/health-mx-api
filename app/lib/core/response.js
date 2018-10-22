const Boom = require('boom')
const HttpStatus = require('http-status-codes')
const logger = require('../logger')

const RESPONSE_HEADERS = {
  'Access-Control-Allow-Origin': '*',
}

module.exports = (data, _headers = {}) => {
  logger.debug(`RESPONSE: ${JSON.stringify(data)}`)

  const headers = {
    ..._headers,
    ...RESPONSE_HEADERS,
  }

  let body = data
  let statusCode = HttpStatus.OK

  if (Boom.isBoom(data)) {
    if (data.error && data.error.stack) {
      logger.debug(`ERROR: ${JSON.stringify(data.error.stack.split('\n'), null, ' ')}`)
    }

    const boomData = data.output
    const boomStatus = boomData.statusCode

    body = JSON.stringify(boomData.payload)
    statusCode = boomStatus
  } else if (!(typeof data === 'string')) {
    body = JSON.stringify(data)
  }

  return {
    headers,
    body,
    statusCode,
  }
}
