const Logger = require('../modules/logger')
const HandoverProtocol = require('./HandoverProtocol.js')

class HandoverReply {
  constructor (config, emitter, recipient_id) {
    this.emitter = emitter
    this.recipient_id = recipient_id
    this.log = new Logger(config, 'handover_reply', emitter)
    this.handover = new HandoverProtocol(config, emitter)
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

module.exports = HandoverReply
