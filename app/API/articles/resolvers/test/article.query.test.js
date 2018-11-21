const newsAPI = require('../../../../lib/news')
const { Query } = require('../article.query')

newsAPI.getHealthData = jest.fn()

describe('Query.articles', () => {
  it('should call the newsAPI.getHealthData function', async () => {
    await Query.articles()
    expect(newsAPI.getHealthData).toBeCalled()
  })
})
