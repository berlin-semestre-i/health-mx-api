const news = require('../../../lib/news')

const articles = async () => {
  const articleArray = await news.getHealthData()

  return articleArray
}

module.exports = {
  Query: {
    articles,
  },
}
