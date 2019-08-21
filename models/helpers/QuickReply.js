class QuickReply {
  constructor (type, title, payload, imageUrl) {
    this.content_type = type
    if (type === 'text') {
      this.title = title
      this.payload = payload
      if (imageUrl) this.image_url = imageUrl
    }
  }
}

module.exports = QuickReply
