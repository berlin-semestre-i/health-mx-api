const dynamoORM = require('../db/admin/orm')

class DatabaseRepository {
  constructor(table) {
    this.tableName = table
  }

  async createOrUpdate(key, data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    return currentTable.update(key, data, 'NEW')
  }

  async add(data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    await currentTable.notExists('id').add(data)
  }

  async get(key) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    return currentTable.get(key)
  }

  async getAll() {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    const { Items } = await currentTable.scan()
    return Items
  }

  async batchGet(keys) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    const keySet = { [this.tableName]: { Keys: keys } }
    const batchResult = await currentTable.batchGet(keySet)
    return batchResult[this.tableName]
  }

  async update(key, data) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    const keyNames = Object.keys(key)
    return currentTable.exists(keyNames).update(key, data, 'NEW')
  }

  async delete(key) {
    const currentTable = dynamoORM.getClient().select(this.tableName)
    const { Attributes } = await currentTable.delete(key)
    return Attributes
  }
}

module.exports = DatabaseRepository
