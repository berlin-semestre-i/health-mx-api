const Boom = require('boom')
const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const {
  USER_POOL,
  USER_POOL_CLIENT_ID,
  JWKS_URI,
} = process.env

const Cognito = {
  getUserDataFromToken: async (authToken) => {
    const decodedToken = await Cognito.verifyToken(authToken)
    const creationDate = decodedToken.iat
    return {
      id: decodedToken.sub,
      cognitoGroups: decodedToken['cognito:groups'],
      username: decodedToken.username,
      sessionId: decodedToken.jti,
      createdAt: creationDate,
      updatedAt: creationDate,
      expirationDate: decodedToken.exp,
    }
  },

  verifyToken: (authToken) => {
    const client = jwksClient({ jwksUri: JWKS_URI })
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) {
          callback(err)
        } else {
          const signingKey = key.publicKey || key.rsaPublicKey
          callback(null, signingKey)
        }
      })
    }
    return new Promise((resolve, reject) => {
      jwt.verify(authToken, getKey, {
        ignoreExpiration: false,
      }, (error, decoded) => {
        if (error) reject(Boom.unauthorized(error.message))
        else if (decoded.iss !== USER_POOL) reject(Boom.unauthorized())
        else if (decoded.client_id !== USER_POOL_CLIENT_ID) reject(Boom.unauthorized())
        else resolve(decoded)
      })
    })
  },
}

module.exports = Cognito
