const SessionRepository = require('../repositories/SessionRepository')
const UserModel = require('./user')

const repository = new SessionRepository()

const SessionModel = {
  get: userID => repository.get({ userID }),

  createOrUpdate: async (userID, authToken = null) => {
    const localUser = await UserModel.getAndValidate(userID)
    const abilities = await UserModel.abilities(userID)
    localUser.ability = abilities.rules
    localUser.authToken = authToken
    delete localUser.id

    return repository.createOrUpdate({ userID }, localUser)
  },
}

module.exports = SessionModel
