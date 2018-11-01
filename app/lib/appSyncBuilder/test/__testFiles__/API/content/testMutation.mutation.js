const createContentDefinition = async (parent, args) => ({ parent, args })

module.exports = {
  Mutation: {
    createContentDefinition,
  },
}
