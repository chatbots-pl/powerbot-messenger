class MessageFrame {
  constructor (message, recipient, options) {
    options = options || {}
    if (typeof (recipient) === 'object') options = recipient
    this.messaging_type = options.messaging_type || 'RESPONSE'
    this.recipient = {}
    this.recipient.id = options.recipient_id || recipient
    this.message = message
  }
}

module.exports = MessageFrame
