const axios = require('axios')

const createError = require('../modules/create_error')
const delay = require('../modules/delay')
const Logger = require('../modules/logger')

class Typer {
  constructor (config, emitter) {
    this.api_url = config.api_url || `https://graph.facebook.com/${config.api_version}/me/messages?access_token=${config.access_token}`
    this.emitter = emitter
    this.log = new Logger(config, 'typer', emitter)
  }

  async on (id, time) {
    try {
      const body = {
        recipient: {
          id: id
        },
        sender_action: 'typing_on'
      }

      const response = await axios.post(this.api_url, body)
      this.emitter.emit('request_outgoing', body, response)
      await delay(time)
      return response
    } catch (e) {
      throw createError(e)
    }
  }

  async off (id) {
    try {
      const body = {
        recipient: {
          id: id
        },
        sender_action: 'typing_off'
      }

      const response = await axios.post(this.api_url, body)
      this.emitter.emit('request_outgoing', body, response)
      return response
    } catch (e) {
      throw createError(e)
    }
  }

  async markSeen (id) {
    try {
      const body = {
        recipient: {
          id: id
        },
        sender_action: 'mark_seen'
      }

      const response = await axios.post(this.api_url, body)
      this.emitter.emit('request_outgoing', body, response)
      return response
    } catch (e) {
      this.log.error(createError(e))
    }
  }
}

module.exports = Typer
