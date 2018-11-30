const Boom = require('boom')
const path = require('path')
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas')
const { Model } = require('objection')
const { zipObject } = require('lodash')

const db = require('./db/medic/db.js')
const directives = require('./config/directives')
const handleDynamoError = require('./db/admin/dynamoDBErrorHandler')
const logger = require('./lib/logger')
const Response = require('./lib/core/response')

const { LOG_LEVEL } = process.env
const resolversArray = fileLoader(path.join(__dirname, 'API/**/resolvers/*.js'))
const resolvers = mergeResolvers(resolversArray)

const processDirectives = async (event) => {
  event.directives.forEach((name) => {
    if (!directives[name]) {
      throw new Error(`Directive ${name} is not defined`)
    }
  })

  const promises = event.directives.map(name => directives[name](event))
  const data = await Promise.all(promises)
  const result = zipObject(event.directives, data)

  return result
}

module.exports.graphqlHandler = async (event) => {
  const { knex } = db

  Model.knex(knex)
  try {
    logger.info(JSON.stringify(event, null, 2), 'Request')
    process.setMaxListeners(0)
    process.once('unhandledRejection', () => {})

    const { authorize } = await processDirectives(event)
    const resolver = resolvers[event.type][event.resolver]
    logger.info(`resolver:${event.type}-${event.resolver}`)

    const response = await resolver(event.args, event.parent, authorize)

    if (event.isOffline || event.isHttp) {
      return Response(response)
    }

    return response
  } catch (error) {
    const dynamoError = handleDynamoError(error)
    if (Boom.isBoom(error)) {
      logger.debug(error)
      throw (error)
    } else if (dynamoError) {
      logger.debug(dynamoError)
      throw dynamoError
    }

    logger.error(error)
    throw (LOG_LEVEL === 'debug') ? error : new Error('InternalError')
  }
}
