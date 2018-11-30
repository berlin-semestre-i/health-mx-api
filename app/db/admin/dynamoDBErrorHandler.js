const Boom = require('boom')

const handleDynamoDBError = (error) => {
  if (error.code === 'ConditionalCheckFailedException') return Boom.conflict('There was a conflict inserting the Record in the DB')

  return undefined
}

module.exports = handleDynamoDBError
