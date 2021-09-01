const axios = require('axios')
const MessageFrame = require('./MessageFrame.js')
const MessageBase = require('./MessageBase.js')
const TemplateBase = require('./TemplateBase.js')
const Attachment = require('./AttachmentMessage.js')
const Typer = require('./Typer.js')
const Logger = require('../modules/logger')

const createError = require('../modules/create_error')
const HandoverProtocol = require('./HandoverProtocol.js')

class Sender {
  constructor (config, recipientId, emitter, recipientField = 'id') {
    config = config || {}
    this.config = config
    this.access_token = config.access_token
    this.recipient_id = recipientId || null
    this.api_version = config.api_version
    this.api_url = this.config.api_url || `https://graph.facebook.com/${this.api_version}/me/messages?access_token=${this.access_token}`
    this.setting_url = this.config.setting_url || `https://graph.facebook.com/${this.api_version}/me/messenger_profile?access_token=${this.access_token}`
    this.natural_typing = config.natural_typing !== false
    this.natural_typing_speed = config.natural_typing_speed || 50
    this.typing = new Typer(config, emitter)
    this.log = new Logger(this.config, 'sender', emitter)
    this.emitter = emitter
    this.recipient_field = recipientField
    this.handover = new HandoverProtocol(config, emitter)
  }

  async raw (message) {
    try {
      const text = message.message.text || message.message.attachment.payload.text
      if (text && this.natural_typing && message.recipient.id) await this.typing.on(message.recipient.id, this.calculateTypingTime(text))
      const response = await axios.post(this.api_url, message)
      this.emitter.emit('request_outgoing', message, response)
      this.emitter.emit('message_sent', message, response)
      return response
    } catch (e) {
      throw createError(e)
    }
  }

  calculateTypingTime (text) {
    const cps = this.natural_typing_speed
    const time = Math.round((text.length / cps) * 1000)
    if (time < 5000) return time
    else return 5000
  }

  text (text, options) {
    if (!text) throw createError('Message text can\'t be empty!')

    let optionsCopy = {}
    if (options) Object.assign(optionsCopy, options)
    else optionsCopy = {}
    optionsCopy.text = text
    optionsCopy.recipient_id = this.recipient_id || options.recipient_id
    optionsCopy.recipient_field = this.recipient_field
    const message = new MessageFrame(new MessageBase(optionsCopy), optionsCopy)

    return this.raw(message)
  }

  quickReplies (text, replies, options) {
    if (!text) throw createError('Message text can\'t be empty!')

    let optionsCopy = {}
    if (options) Object.assign(optionsCopy, options)
    else optionsCopy = {}
    optionsCopy.text = text
    optionsCopy.recipient_id = this.recipient_id || options.recipient_id
    optionsCopy.replies = replies
    optionsCopy.recipient_field = this.recipient_field
    const message = new MessageFrame(new MessageBase(optionsCopy), optionsCopy)

    return this.raw(message)
  }

  buttons (text, buttons, replies, options) {
    if (!text) throw createError('Message text can\'t be empty!')
    const optionsCopy = {}

    if (options) Object.assign(optionsCopy, options)
    else if (!Array.isArray(replies) && typeof (replies) === 'object') Object.assign(optionsCopy, replies)
    else {
      optionsCopy.quick_replies = replies
    }

    optionsCopy.text = text
    optionsCopy.recipient_id = this.recipient_id || optionsCopy.recipient_id
    optionsCopy.buttons = buttons
    optionsCopy.recipient_field = this.recipient_field
    const message = new MessageFrame(new TemplateBase(optionsCopy), optionsCopy)

    return this.raw(message)
  }

  async setting (data) {
    try {
      const response = await axios.post(this.setting_url, data)
      this.emitter.emit('request_outgoing', data, response)
      return response
    } catch (e) {
      throw createError(e)
    }
  }

  generic (elements, options) {
    let optionsCopy = {}
    if (options) Object.assign(optionsCopy, options)
    else optionsCopy = {}
    optionsCopy.recipient_id = this.recipient_id || options.recipient_id
    optionsCopy.generics = elements
    optionsCopy.recipient_field = this.recipient_field
    const message = new MessageFrame(new TemplateBase(optionsCopy), optionsCopy)
    return this.raw(message)
  }

  media (element, options) {
    let optionsCopy = {}
    if (options) Object.assign(optionsCopy, options)
    else optionsCopy = {}
    optionsCopy.recipient_id = this.recipient_id || options.recipient_id
    optionsCopy.medias = [element]
    optionsCopy.recipient_field = this.recipient_field
    const message = new MessageFrame(new TemplateBase(optionsCopy), optionsCopy)
    return this.raw(message)
  }

  attachment (type, url, options) {
    options = options || {}
    options.recipient_id = this.recipient_id || options.recipient_id
    options.is_reusable = options.is_reusable || true
    options.url = url
    options.type = type
    options.recipient_field = this.recipient_field
    const message = new Attachment(options)
    return this.raw(message)
  }

  oneTimeNotificationRequest (title, payload, options) {
    let optionsCopy = {}
    if (options) Object.assign(optionsCopy, options)
    else optionsCopy = {}

    optionsCopy.recipient_id = this.recipient_id || options.recipient_id
    optionsCopy.recipient_field = this.recipient_field
    optionsCopy.otn_request = {
      title,
      payload
    }

    const message = new MessageFrame(new TemplateBase(optionsCopy), optionsCopy)
    return this.raw(message)
  }

  passThreadControl (appId, metadata) {
    return this.handover.passControl(appId, this.recipient_id, metadata)
  }

  requestThreadControl (metadata) {
    return this.handover.requestControl(this.recipient_id, metadata)
  }

  takeThreadControl (metadata) {
    return this.handover.takeControl(this.recipient_id, metadata)
  }
}

module.exports = Sender
