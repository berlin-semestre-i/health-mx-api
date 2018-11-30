const NewsAPI = require('newsapi')

const { NEWS_API_KEY } = process.env

const newsapi = new NewsAPI(NEWS_API_KEY || 'none')

const news = {

  getData: async () => {
    const response = await newsapi.v2.everything({
      q: 'salud',
      language: 'es',
      pageSize: 4,
    })
    const articles = response.articles.map(article => ({
      title: article.title,
      url: article.url,
      urlToImage: article.urlToImage,
    }))
    return articles
  },
}

module.exports = news
