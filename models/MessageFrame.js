class MessageFrame {
  // Recipient field in options to provide backward compability, should be changed in v2.0
  constructor (message, recipient, options) {
    let rField = 'id'
    options = options || {}
    if (typeof recipient === 'object') options = recipient
    if (typeof options === 'object') {
      this.messaging_type = options.messaging_type || 'RESPONSE'
      rField = options.recipient_field || rField
      if (this.messaging_type === 'MESSAGE_TAG') this.tag = options.tag
    } else if (typeof options === 'string') {
      this.messaging_type = 'MESSAGE_TAG'
      this.tag = options
    }
    this.recipient = {}
    this.recipient[rField] = options.recipient_id || recipient
    this.message = message
  }
}

module.exports = MessageFrame
