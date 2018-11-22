const news = require('../../../lib/news')

const articles = async () => news.getData()

module.exports = {
  Query: {
    articles,
  },
}
