const DatabaseRepository = require('./DatabaseRepository')
const { SessionTableName } = require('../db/admin/tables')

class SessionRepository extends DatabaseRepository {
  constructor() {
    super(SessionTableName)
  }
}

module.exports = SessionRepository
