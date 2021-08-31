const PowerbotMessenger = require('../index.js')
const config = require('./config')
const pbm = new PowerbotMessenger(config.pbm)
const ThreadControlBody = require('../models/helpers/ThreadControlBody.js')
const expect = require('chai').expect
const should = require('chai').should()

describe('ThreadControlBody class', function () {
  it('Should form passing thread body', () => {
    const data = new ThreadControlBody(123456789, 987654321, 'metadata')
    expect(data).to.haveOwnProperty('recipient')
    expect(data).to.haveOwnProperty('target_app_id', 123456789)
    expect(data).to.haveOwnProperty('metadata', 'metadata')
    expect(data.recipient).to.haveOwnProperty('id', 987654321)
  })

  it('Should form thread control request/take body', () => {
    const data = new ThreadControlBody(null, 987654321, 'metadata')
    expect(data).to.haveOwnProperty('recipient')
    expect(data).to.not.haveOwnProperty('target_app_id')
    expect(data).to.haveOwnProperty('metadata', 'metadata')
    expect(data.recipient).to.haveOwnProperty('id', 987654321)
  })
})
