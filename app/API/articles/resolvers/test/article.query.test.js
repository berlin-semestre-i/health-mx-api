const newsAPI = require('../../../../lib/news')
const { Query } = require('../article.query')

newsAPI.getData = jest.fn()

describe('Query.articles', () => {
  it('should call the newsAPI.getHealthData function', async () => {
    await Query.articles()
    expect(newsAPI.getData).toBeCalled()
  })
})
