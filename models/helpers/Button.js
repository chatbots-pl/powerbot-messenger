const createError = require('../../modules/create_error')

class Button {
  constructor (type, title, payload) {
    let supported = ['web_url', 'postback', 'phone_number', 'element_share']
    if (supported.indexOf(type) === -1) throw createError('This type of button is not currently supported by Powerbot Messenger. Please use raw send option instead.')
    this.type = type
    if (type !== 'element_share') this.title = title
    if (type === 'web_url') this.url = payload
    else if (type === 'postback' || type === 'phone_number') this.payload = payload
  }
}

module.exports = Button
