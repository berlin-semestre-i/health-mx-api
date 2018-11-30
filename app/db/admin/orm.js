const dynamoNode = require('dynamo-node')

let client

const getClient = () => {
  if (!client) {
    client = dynamoNode(process.env.AWS_REGION || process.env.REGION || 'us-east-1')
  }
  return client
}

module.exports = { getClient }
