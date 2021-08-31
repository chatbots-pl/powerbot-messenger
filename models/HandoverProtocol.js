const axios = require('axios')

const createError = require('../modules/create_error')
const Logger = require('../modules/logger')
const ThreadControlBody = require('./helpers/ThreadControlBody')

class HandoverProtocol {
  constructor (config, emitter) {
    this.api_url = config.api_url || `https://graph.facebook.com/${config.api_version}/me`
    this.token = config.access_token
    this.emitter = emitter
    this.log = new Logger(config, 'typer', emitter)
  }

  _createApiUrl (path) {
    return this.api_url + path + '?access_token=' + this.token
  }

  async passControl (appId, userId, metadata) {
    try {
      const data = new ThreadControlBody(appId, userId, metadata)
      await axios.post(this._createApiUrl('/pass_thread_control'), data)
    } catch (e) {
      throw createError(e)
    }
  }

  async takeControl (userId, metadata) {
    try {
      const data = new ThreadControlBody(null, userId, metadata)
      await axios.post(this._createApiUrl('/take_thread_control'), data)
    } catch (e) {
      throw createError(e)
    }
  }

  async requestControl (userId, metadata) {
    try {
      const data = new ThreadControlBody(null, userId, metadata)
      await axios.post(this._createApiUrl('/request_thread_control'), data)
    } catch (e) {
      throw createError(e)
    }
  }

  async getSecondaryReceivers (...fields) {
    try {
      fields = (fields.length > 0) ? fields : ['id', 'name']
      const url = this._createApiUrl('/secondary_receivers') + '&fields=' + fields.join()
      const res = await axios.get(url)
      return res.data.data
    } catch (e) {
      throw createError(e)
    }
  }

  async getOwner (userId) {
    try {
      const url = this._createApiUrl('/thread_owner') + '&recipient=' + userId
      const res = await axios.get(url)
      return res.data.data
    } catch (e) {
      throw createError(e)
    }
  }
}

module.exports = HandoverProtocol
