class Message {
  constructor (options) {
    options = options || {}
    Object.assign(options, {})

    this.attachment = {
      type: 'template',
      payload: {}
    }

    if (options.buttons) {
      let p = this.attachment.payload
      p.template_type = 'button'
      p.text = options.text
      p.buttons = options.buttons
      if (options.quick_replies) this.quick_replies = options.quick_replies
    }

    if (options.generics) {
      let p = this.attachment.payload
      p.template_type = 'generic'
      p.elements = options.generics
    }
  }
}

module.exports = Message
