const createError = require('../../modules/create_error')

class Button {
  constructor (type, title, payload) {
    const supported = ['web_url', 'postback', 'phone_number', 'element_share', 'account_link', 'account_unlink']
    const nonTitled = ['element_share', 'account_link', 'account_unlink']
    if (supported.indexOf(type) === -1) throw createError('This type of button is not currently supported by Powerbot Messenger. Please use raw send option instead.')
    if (nonTitled.indexOf(type) === -1) this.title = title
    this.type = type
    if (type === 'web_url') this.url = payload
    else if (type === 'postback' || type === 'phone_number') this.payload = payload
    else if (type === 'account_link') this.url = title
  }
}

module.exports = Button
