const axios = require('axios')

const createError = require('../modules/create_error')

const HandoverReply = require('./HandoverReply')

let that = null

class User {
  constructor (messengerId, config, sender, emitter) {
    if (!messengerId) throw createError('You must pass messenger id of user!')
    this.config = config || {}
    this.messenger_id = messengerId
    this.api_url = `https://graph.facebook.com/${config.api_version}/${this.messenger_id}`
    this.send = sender
    this.handover = new HandoverReply(config, emitter, messengerId)
    this.emitter = emitter
    that = this
  }

  async getData (...fields) {
    try {
      fields = (fields.length > 0) ? fields : ['first_name, last_name, id, locale, timezone, gender']
      let url = `${this.api_url}?fields=${fields.toString().replace(' ', '')}&access_token=${this.config.access_token}`
      let data = await axios.get(url)
      that.emitter.emit('request_outgoing', null, data)

      return data.data
    } catch (e) {
      throw createError(e)
    }
  }
}

module.exports = User
