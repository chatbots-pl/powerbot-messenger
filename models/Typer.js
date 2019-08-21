const axios = require('axios')

const createError = require('../modules/create_error')
const delay = require('../modules/delay')

class Typer {
  constructor (options, emitter) {
    this.api_url = options.api_url || `https://graph.facebook.com/${options.api_version}/me/messages?access_token=${options.access_token}`
    this.emitter = emitter
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
}

module.exports = Typer
