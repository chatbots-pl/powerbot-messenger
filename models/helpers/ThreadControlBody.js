class ThreadControlBody {
  constructor (appId, userId, metadata = '') {
    if (appId) {
      this.target_app_id = appId
    }
    this.recipient = {
      id: userId
    }
    this.metadata = metadata
  }
}

module.exports = ThreadControlBody
