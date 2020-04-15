class Message {
  constructor (options) {
    options = options || {}
    Object.assign(options, {})

    this.attachment = {
      type: 'template',
      payload: {}
    }

    if (options.buttons) {
      const p = this.attachment.payload
      p.template_type = 'button'
      p.text = options.text
      p.buttons = options.buttons
      if (options.quick_replies) this.quick_replies = options.quick_replies
    }

    if (options.generics) {
      const p = this.attachment.payload
      p.template_type = 'generic'
      p.elements = options.generics
    }

    if (options.medias) {
      const p = this.attachment.payload
      p.template_type = 'media'
      p.elements = options.medias
    }

    if (options.otn_request) {
      const p = this.attachment.payload
      p.template_type = 'one_time_notif_req'
      p.title = options.otn_request.title
      p.payload = options.otn_request.payload
    }
  }
}

module.exports = Message
