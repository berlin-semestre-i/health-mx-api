const Boom = require('boom')

const RoleRepository = require('../repositories/RoleRepository')

const repository = new RoleRepository()

const RoleModel = {
  getClassName: () => 'RoleModel',

  create: async (createdBy, roleData) => {
    const nowTimestamp = new Date().toISOString()
    const newRole = {
      createdAt: nowTimestamp,
      updatedAt: nowTimestamp,
      createdBy,
      updatedBy: createdBy,
      ...roleData,
    }

    await repository.add(newRole)
    return newRole
  },

  get: async (name) => {
    const role = await repository.get({ name })

    if (!role) throw Boom.notFound(`Role with name ${name} not found`)

    return role
  },

  getList: async (roleNames) => {
    const uniqueRoleNames = Array.from(new Set(roleNames))
    if (uniqueRoleNames.length === 0) return []

    return repository.batchGet({ name: uniqueRoleNames })
  },

  getRolesByType: async roleType => repository.getByType(roleType),

  update: async (updatedBy, name, roleData) => {
    const nowTimestamp = new Date().toISOString()
    const newRole = {
      updatedBy,
      updatedAt: nowTimestamp,
      ...roleData,
    }
    return repository.update({ name }, newRole)
  },
}

module.exports = RoleModel
