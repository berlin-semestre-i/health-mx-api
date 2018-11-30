const Boom = require('boom')
const { Ability } = require('@casl/ability')

const Cognito = require('./Cognito')
const SessionModel = require('../models/session')
const UserModel = require('../models/user')
const { ROLES } = require('../config/constants')

const operations = ['create', 'read', 'update', 'delete', 'moderate', 'hide', 'search']
Ability.addAlias('manage', operations)

const authenticate = async (event) => {
  const { headers } = event
  const authToken = headers.authorization || headers.authorization
  const siteID = headers['site-id']

  if (!siteID) throw Boom.badRequest('site-id header is not present')
  if (!authToken) throw Boom.badRequest('authorization header is not present')

  const userData = await Cognito.getUserDataFromToken(authToken)
  let localUser = await SessionModel.get(userData.id)
  if (!localUser || localUser.authToken !== authToken) {
    const user = await UserModel.get(userData.id)
    if (!user) {
      userData.role = ROLES.BENEFICIARY
      await UserModel.createOrUpdate(userData)
    }
    localUser = await SessionModel.createOrUpdate(userData.id, authToken)
  }

  localUser.id = localUser.userID
  localUser.ability = new Ability(localUser.ability)
  localUser.authToken = authToken

  return localUser
}

module.exports = authenticate
