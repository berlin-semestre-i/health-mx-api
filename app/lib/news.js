const NewsAPI = require('newsapi')

const { NEWS_API_KEY } = process.env

const newsapi = new NewsAPI(NEWS_API_KEY || 'none')

const news = {

  getData: async () => newsapi.v2.everything({
    q: 'salud',
    language: 'es',
    pageSize: 4,
  }),

  getHealthData: async () => {
    const response = await news.getData()
    console.log(response)
    const data = response.articles
    const articles = data.map(article => ({
      title: article.title,
      url: article.url,
      urlToImage: article.urlToImage,
    }))
    return articles
  },
}

module.exports = news
