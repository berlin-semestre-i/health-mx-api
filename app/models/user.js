const Boom = require('boom')
const { Ability, AbilityBuilder } = require('@casl/ability')

const Cognito = require('../lib/Cognito')
const RoleModel = require('./role')
const SessionRepository = require('../repositories/SessionRepository')
const UserRepository = require('../repositories/UserRepository')
const { ROLES } = require('../config/constants')

const repository = new UserRepository()
const sessionRepository = new SessionRepository()
const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}

const validateRole = async (roleName) => {
  const role = await RoleModel.get(roleName)
  if (!role) throw Boom.notFound('Role does not exist')
}

const UserModel = {
  getClassName: () => 'UserModel',

  abilities: async (userId) => {
    const user = UserModel.get(userId)
    const { actions } = user.role
    const { rules, can } = AbilityBuilder.extract()
    actions.forEach((levelAccess) => {
      const tokens = levelAccess.split(':')
      const [operation, entity, rawFields] = tokens
      if (rawFields) {
        const fields = rawFields.replace(/\[|\]/g, '').split(',')
        fields.forEach(field => can(operation, entity, field))
      } else {
        can(operation, entity)
      }
    })
    return new Ability(rules)
  },

  createOrUpdate: async (userData) => {
    const { id } = userData
    const localUser = await repository.get({ id }) || {}
    const nowTimestamp = new Date().toISOString()

    const newOrUpdatedUser = {
      ...userData,
      status: localUser.status || UserStatus.ACTIVE,
      createdAt: localUser.createdAt || nowTimestamp,
      updatedAt: nowTimestamp,
    }
    delete newOrUpdatedUser.id
    const updatedUser = await repository.update({ id }, newOrUpdatedUser)
    sessionRepository.delete({ userId: id })

    return updatedUser
  },

  delete: async (userId) => {
    await repository.delete({ id: userId })

    return true
  },

  get: id => repository.get({ id }),

  getRole: async (userId) => {
    const user = await UserModel.get(userId)
    return RoleModel.get(user.role)
  },

  isAdmin: async (userId) => {
    const user = await UserModel.get(userId)
    return RoleModel.get(user.role) === ROLES.ADMIN
  },

  setRole: async (userId, role) => {
    await validateRole(role)
    const userData = UserModel.get(userId)
    userData.role = role
    const user = await UserModel.createOrUpdate(userData)

    return !!user
  },

  getList: async (IDs) => {
    const uniqueIDs = Array.from(new Set(IDs))
    if (uniqueIDs.length === 0) return []

    return repository.batchGet({ id: uniqueIDs })
  },

  searchUser: async (email) => {
    const user = await Cognito.searchUserProfile(email)
    if (!user) throw Boom.notFound(`User with email: ${email} not Found`)

    return UserModel.createOrUpdate(user)
  },

  getAndValidate: async (id) => {
    const user = await UserModel.get(id)
    if (!user) throw Boom.notFound(`User with id = ${id} not found`)

    return user
  },
}

module.exports = UserModel
