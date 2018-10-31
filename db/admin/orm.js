const dynamoNode = require('dynamo-node')

let client

const getClient = () => {
  if (!client) {
    client = dynamoNode(process.env.REGION)
  }
  return client
}

module.exports = { getClient }
