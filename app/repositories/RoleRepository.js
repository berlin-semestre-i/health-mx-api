const DatabaseRepository = require('./DatabaseRepository')
const dynamoORM = require('../db/admin/orm')
const { RoleTableName } = require('../db/admin/tables')

class RoleRepository extends DatabaseRepository {
  constructor() {
    super(RoleTableName)
  }

  async add(data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    await currentTable.notExists('name').add(data)
  }

  async getByType(type) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    const { Items } = await currentTable.useIndex('typeIndex').query('type', '=', type)
    return Items
  }

  async update(key, data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    return currentTable.exists('name').update(key, data, 'NEW')
  }
}

module.exports = RoleRepository
