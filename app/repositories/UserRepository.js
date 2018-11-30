const DatabaseRepository = require('./DatabaseRepository')
const dynamoORM = require('../db/admin/orm')
const { UserTableName } = require('../db/admin/tables')

class UserRepository extends DatabaseRepository {
  constructor() {
    super(UserTableName)
  }

  async update(key, data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    return currentTable.update(key, data, 'NEW')
  }
}

module.exports = UserRepository
