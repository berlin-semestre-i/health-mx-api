/* eslint-disable no-console */
const moment = require('moment')

const logger = require('../logger')

process.env.LOG_LEVEL = 'info'

jest.mock('moment')
const messageText = 'My dummy message'
const messageObject = {
  message: messageText,
  code: 'Error message',
}
const mockDate = '2018-05-28 12:00:00 -5:00'
moment.mockImplementation(() => ({
  format: () => mockDate,
}))

describe('When importing Logger module', () => {
  it('should return an Object', () => {
    expect(logger).toEqual(expect.objectContaining({
      error: expect.any(Function),
      warn: expect.any(Function),
      info: expect.any(Function),
      debug: expect.any(Function),
    }))
  })
})

describe('Logger behaviour', () => {
  it('should return a valid log message', () => {
    const numberCalls = 2
    const spy = jest.spyOn(logger, 'info')
    console.log = jest.fn()
    logger.info(messageText)
    logger.info(messageObject, 'MYTEXT')

    expect(spy).toHaveBeenCalledTimes(numberCalls)
    expect(console.log).toHaveBeenCalledTimes(numberCalls)
    expect(console.log.mock.calls[0][0]).toBe(`${mockDate} [INFO] [LOGGER] ${messageText}`)
    expect(console.log.mock.calls[1][0]).toBe(`${mockDate} [INFO] [MYTEXT] [object Object]`)
  })

  it('should only call the allowed levels of logging', () => {
    const numberCalls = 4
    console.log = jest.fn()
    logger.error(messageText)
    logger.warn(messageText)
    logger.info(messageText)
    logger.debug(messageText)

    expect(console.log).toHaveBeenCalledTimes(numberCalls)
  })
})
