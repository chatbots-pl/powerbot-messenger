const isUrl = require('../../modules/is_url')

class Media {
  constructor (type, attachmentIdOrUrl, buttons) {
    if (typeof (type) === 'object') {
      const o = type
      if (o.url) this.url = o.url
      else if (o.attachment_id) this.attachment_id = o.attachment_id
      if (o.buttons) this.buttons = o.buttons
      this.media_type = o.media_type
    } else {
      if (isUrl(attachmentIdOrUrl)) this.url = attachmentIdOrUrl
      else this.attachment_id = attachmentIdOrUrl
      if (buttons) this.buttons = buttons
      this.media_type = type
    }
  }
}

module.exports = Media
