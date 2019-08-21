const axios = require('axios')

const createError = require('../modules/create_error')

class Uploader {
  constructor (config, emitter) {
    config = config || {}
    this.access_token = config.access_token
    this.api_version = config.api_version
    this.api_url = `https://graph.facebook.com/${this.api_version}/me/message_attachments?access_token=${this.access_token}`
    this.emitter = emitter
  }

  async fromUrl (type, url) {
    try {
      let o = {
        message: {
          attachment: {
            type: type,
            payload: {
              is_reusable: true,
              url: url
            }
          }
        }
      }

      const response = await axios.post(this.api_url, o)
      this.emitter.emit('request_outgoing', o, response)
      return response.data.attachment_id
    } catch (e) {
      throw createError(e)
    }
  }
}

module.exports = Uploader
