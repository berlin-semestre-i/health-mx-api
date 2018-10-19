const moment = require('moment')

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug'
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const createLog = (message, level, label = 'LOGGER') => {
  const now = moment()
  const timestamp = now.format('YYYY-MM-DD HH:mm:ss Z')
  return `${timestamp} [${level.toUpperCase()}] [${label}] ${message}`
}

const log = (level, message, label) => {
  if (levels[level] <= levels[LOG_LEVEL]) {
    const logMessage = createLog(message, level, label)
    console.log(logMessage) // eslint-disable-line
  }
}

const logger = {
  error: (message, label) => log('error', message, label),
  warn: (message, label) => log('warn', message, label),
  info: (message, label) => log('info', message, label),
  debug: (message, label) => log('debug', message, label),
}

module.exports = logger
