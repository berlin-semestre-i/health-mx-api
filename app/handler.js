const Boom = require('boom')
const Knex = require('knex')
const path = require('path')
const { fileLoader, mergeResolvers } = require('merge-graphql-schemas')
const { Model } = require('objection')

const connection = require('../knexfile')
const logger = require('./lib/logger')

const { LOG_LEVEL } = process.env
const resolversArray = fileLoader(path.join(__dirname, 'API/**/resolvers/*.js'))
const resolvers = mergeResolvers(resolversArray)

module.exports.graphqlHandler = async (event) => {
  // const knex = Knex(process.env.NODE_ENV === 'develop' ? connection.develop : connection.prod)
  const knex = Knex(connection.production)

  Model.knex(knex)
  try {
    logger.info(JSON.stringify(event, null, 2), 'Request')
    process.setMaxListeners(0)
    process.once('unhandledRejection', () => {})

    const resolver = resolvers[event.type][event.resolver]
    const response = await resolver(event.args, event.parent)
    return response
  } catch (error) {
    if (Boom.isBoom(error)) {
      logger.debug(error)
      throw (error)
    }
    logger.error(error)
    throw (LOG_LEVEL === 'debug') ? error : new Error('InternalError')
  } finally {
    knex.destroy()
  }
}
