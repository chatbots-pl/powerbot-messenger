const PowerbotMessenger = require('../index.js')
const config = require('./config')
const pbm = new PowerbotMessenger(config.pbm)
const expect = require('chai').expect
const should = require('chai').should()

describe('User Object', function () {
  it('Should correctly fetch user data', async () => {
    const user = await pbm.User(config.testUserId).getData()
    expect(user).to.be.an('object')
  })
  it('Should send message to user', async () => {
    const user = await pbm.User(config.testUserId).send.text('Testing...')
    expect(user).to.be.an('object')
  })
})

describe('Sender Class', function () {
  this.timeout(8000)
  const options = {
    recipient_id: config.testUserId
  }

  const qrs = [
    new pbm.Helpers.QuickReply('text', 'QR 1', 'TEST_1'),
    new pbm.Helpers.QuickReply('text', 'QR 2', 'TEST_2')
  ]

  const buttons = [
    new pbm.Helpers.Button('postback', 'BUTTON 1', 'TEST_1'),
    new pbm.Helpers.Button('postback', 'BUTTON 2', 'TEST_2')
  ]

  const card = new pbm.Helpers.Generic({
    title: 'Title',
    subtitle: 'Subtitle'
  })

  const setting = new pbm.Helpers.GetStartedButton()

  const cards = [card, card, card]

  it('Should send message via text() method', async () => {
    await pbm.send.text('Testing text method...', options)
  })
  it('Should send message via quickReplies() method', async () => {
    await pbm.send.quickReplies('Testing quick_replies method...', qrs, options)
  })
  it('Should send message via buttons() method', async () => {
    await pbm.send.buttons('Testing buttons method...', buttons, options)
  })
  it('Should send message (with quick replpies) via buttons() method', async () => {
    await pbm.send.buttons('Testing buttons (with quick_replies) method...', buttons, qrs, options)
  })
  it('Should send message via generic() method', async () => {
    await pbm.send.generic(cards, options)
  })
  it('Should send attachment via attachment() method', async () => {
    await pbm.send.attachment('image', config.attachmentUrl, options)
  })
  it('Should send settings via setting() method', async () => {
    await pbm.send.setting(setting)
  })
})

describe('Uploader module', function () {
  this.timeout(10000)
  it('Should upload attachment from URL and get it\'s ID', async () => {
    const id = await pbm.upload.fromUrl('image', config.attachmentUrl)
    expect(id).to.be.an('string')
  })
})
