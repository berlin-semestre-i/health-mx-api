const getContentDefinition = async (parent, args) => ({ parent, args })

module.exports = {
  Query: {
    getContentDefinition,
  },
}
