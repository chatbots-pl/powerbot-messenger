const createError = require('../modules/create_error')
const axios = require('axios')

class Personas {
  constructor (config) {
    this.access_token = config.access_token
    this.api_version = config.api_version
  }

  async create (name, imageUrl) {
    try {
      const res = await axios.post('https://graph.facebook.com/' + this.api_version + '/me/personas?access_token=' + this.access_token, {
        name: name,
        profile_picture_url: imageUrl
      })
      return res.data.id
    } catch (e) {
      throw createError(e)
    }
  }

  async delete (personaId) {
    try {
      await axios.delete('https://graph.facebook.com/' + this.api_version + '/' + personaId + '?access_token=' + this.access_token)
    } catch (e) {
      throw createError(e)
    }
  }
}

module.exports = Personas
