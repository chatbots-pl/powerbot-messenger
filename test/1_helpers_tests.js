const PowerbotMessenger = require('../index.js')
const config = require('./config')
const pbm = new PowerbotMessenger(config.pbm)
const expect = require('chai').expect
const should = require('chai').should()

describe('Button Helper', function () {
  it('Should create button of type web_url', async () => {
    const btn = new pbm.Helpers.Button('web_url', 'Link to google', 'https://google.com')
    const correct = {
      type: 'web_url',
      title: 'Link to google',
      url: 'https://google.com'
    }
    expect(btn).to.deep.equal(correct)
  })
  it('Should create button of type postback', async () => {
    const btn = new pbm.Helpers.Button('postback', 'Click', 'TEST_1')
    const correct = {
      type: 'postback',
      title: 'Click',
      payload: 'TEST_1'
    }
    expect(btn).to.deep.equal(correct)
  })
  it('Should create button of type phone_number', async () => {
    const btn = new pbm.Helpers.Button('phone_number', 'Call', '1234567890')
    const correct = {
      type: 'phone_number',
      title: 'Call',
      payload: '1234567890'
    }
    expect(btn).to.deep.equal(correct)
  })
  it('Should create button of type element_share', async () => {
    const btn = new pbm.Helpers.Button('element_share')
    const correct = {
      type: 'element_share'
    }
    expect(btn).to.deep.equal(correct)
  })
})

describe('Quick Reply Helper', function () {
  it('Should create quick reply of location type', async () => {
    const qr = new pbm.Helpers.QuickReply('location')
    const correct = {
      content_type: 'location'
    }
    expect(qr).to.deep.equal(correct)
  })
  it('Should create basic quick reply', async () => {
    const qr = new pbm.Helpers.QuickReply('text', 'Title', 'PAYLOAD')
    const correct = {
      content_type: 'text',
      title: 'Title',
      payload: 'PAYLOAD'
    }
    expect(qr).to.deep.equal(correct)
  })
  it('Should create quick reply with image', async () => {
    const qr = new pbm.Helpers.QuickReply('text', 'Title', 'PAYLOAD', 'https://examplpe.com/image.jpg')
    const correct = {
      content_type: 'text',
      title: 'Title',
      payload: 'PAYLOAD',
      image_url: 'https://examplpe.com/image.jpg'
    }
    expect(qr).to.deep.equal(correct)
  })
})

describe('Get Started Helper', function () {
  it('Should create Get Started button with default payload', async () => {
    const gs = new pbm.Helpers.GetStartedButton()
    const correct = {
      get_started: {
        payload: 'GET_STARTED'
      }
    }
    expect(gs).to.deep.equal(correct)
  })
  it('Should create Get Started button with custom payload', async () => {
    const gs = new pbm.Helpers.GetStartedButton('CUSTOM_PAYLOAD')
    const correct = {
      get_started: {
        payload: 'CUSTOM_PAYLOAD'
      }
    }
    expect(gs).to.deep.equal(correct)
  })
})

describe('Greeting Helper', function () {
  it('Should create greeting message with default language', async () => {
    const g = new pbm.Helpers.Greeting('Hi!')
    const correct = {
      greeting: [{
        text: 'Hi!',
        locale: 'default'
      }]
    }
    expect(g).to.deep.equal(correct)
  })
  it('Should create greeting message with default language', async () => {
    const g = new pbm.Helpers.Greeting('Witaj!', 'pl_PL')
    const correct = {
      greeting: [{
        text: 'Witaj!',
        locale: 'pl_PL'
      }]
    }
    expect(g).to.deep.equal(correct)
  })
})

describe('Generic Helper', function () {
  it('Should create card from object', async () => {
    const c = new pbm.Helpers.Generic({
      title: 'Title',
      subtitle: 'Subtitle',
      image_url: 'http://example.com/image.jpg',
      buttons: [new pbm.Helpers.Button('postback', 'Button', 'PAYLOAD')],
      default_action: {}
    })
    const correct = {
      title: 'Title',
      subtitle: 'Subtitle',
      image_url: 'http://example.com/image.jpg',
      buttons: [new pbm.Helpers.Button('postback', 'Button', 'PAYLOAD')],
      default_action: {}
    }
    expect(c).to.deep.equal(correct)
  })
  it('Should create card from function parameters', async () => {
    const c = new pbm.Helpers.Generic('Title', 'Subtitle', 'http://example.com/image.jpg', [new pbm.Helpers.Button('postback', 'Button', 'PAYLOAD')], {})
    const correct = {
      title: 'Title',
      subtitle: 'Subtitle',
      image_url: 'http://example.com/image.jpg',
      buttons: [new pbm.Helpers.Button('postback', 'Button', 'PAYLOAD')],
      default_action: {}
    }
    expect(c).to.deep.equal(correct)
  })
})
