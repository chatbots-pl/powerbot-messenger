const isUrl = require('../modules/is_url')

class Message {
  constructor (options) {
    options = options || {}
    const rField = options.recipient_field || 'id'
    this.messaging_type = options.messaging_type || 'RESPONSE'
    this.recipient = {}
    this.recipient[rField] = options.recipient_id
    this.message = {}
    this.message.attachment = {
      type: options.type,
      payload: {}
    }
    if (isUrl(options.url)) {
      this.message.attachment.payload.is_reusable = options.is_reusable
      this.message.attachment.payload.url = options.url
    } else this.message.attachment.payload.attachment_id = options.url
  }
}

module.exports = Message
