const MessageBase = require('./MessageBase.js')
const TemplateBase = require('./TemplateBase.js')
const isUrl = require('../modules/is_url')

class Text extends MessageBase {
  constructor (text, options) {
    options = options || {}
    super(options)
    this.text = text
  }
}

class QuickReplies extends Text {
  constructor (text, replies, options) {
    super(text, options)
    this.quick_replies = replies
  }
}

class Buttons extends TemplateBase {
  constructor (text, buttons, quickReplies, options) {
    let optionsCopy = options || {}
    const arr = !Array.isArray(quickReplies)
    if (arr) optionsCopy = quickReplies || {}
    optionsCopy.text = text
    optionsCopy.buttons = buttons
    if (!arr) optionsCopy.quick_replies = quickReplies

    super(optionsCopy)
  }
}

class Generic extends TemplateBase {
  constructor (elements, options) {
    options = options || {}
    options.generics = elements
    super(options)
  }
}

class Media extends TemplateBase {
  constructor (element, options) {
    options = options || {}
    options.medias = [element]
    super(options)
  }
}

class Attachment{
  constructor(type, urlOrId, reusable = true){
    this.attachment = {}
    this.attachment.type = type
    this.attachment.payload = {}
    if(isUrl(urlOrId)){
      this.attachment.payload.url = urlOrId
      this.attachment.payload.is_reusable = reusable
    } else {
      this.attachment.payload.attachment_id = urlOrId
    }
  }
}

class Generator {
  constructor (options) {
    this.Text = Text
    this.QuickReplies = QuickReplies
    this.Buttons = Buttons
    this.Generic = Generic
    this.Media = Media
    this.Attachment = Attachment
  }
}

module.exports = Generator
