class MessageFrame {
  constructor (message, recipient, options) {
    options = options || {}
    if (typeof recipient === 'object') options = recipient
    if (typeof options === 'object') {
      this.messaging_type = options.messaging_type || 'RESPONSE'
      if (this.messaging_type === 'MESSAGE_TAG') this.tag = options.tag
    } else if (typeof options === 'string') {
      this.messaging_type = 'MESSAGE_TAG'
      this.tag = options
    }
    this.recipient = {}
    this.recipient.id = options.recipient_id || recipient
    this.message = message
  }
}

module.exports = MessageFrame
