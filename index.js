const Server = require('./models/Server.js')
const Sender = require('./models/Sender.js')
const Helpers = require('./models/Helpers.js')
const User = require('./models/User.js')
const Typer = require('./models/Typer.js')
const Uploader = require('./models/Uploader.js')
const MessageGenerator = require('./models/Generator.js')
const MessageFrame = require('./models/MessageFrame.js')
const Personas = require('./models/Personas.js')
const emitter = require('./modules/emitter')

class PowerbotMessenger {
  constructor (config) {
    config = config || {}
    this.config = config
    this.config.api_version = this.config.api_version || 'v5.0'
    this.config.endpoint = this.config.endpoint || '/webhook'
    this.config.mark_seen = (typeof config.mark_seen !== 'undefined') ? this.config.mark_seen : true

    this.access_token = config.access_token
    this.Server = new Server(config, emitter)
    this.send = new Sender(config, null, emitter)
    this.Helpers = new Helpers()
    this.Typer = new Typer(config, emitter)
    this.upload = new Uploader(config, emitter)
    this.Message = new MessageGenerator(config)
    this.Frame = MessageFrame
    this.personas = new Personas(config)
  }

  User (messengerId) {
    return new User(messengerId, this.config, new Sender(this.config, messengerId, emitter), emitter)
  }
}

module.exports = PowerbotMessenger
