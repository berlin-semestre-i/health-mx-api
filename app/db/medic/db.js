const config = require('../../../knexfile.js')

const env = 'production'

// eslint-disable-next-line import/order
const knex = require('knex')(config[env])

module.exports = knex

knex.migrate.latest([config])
