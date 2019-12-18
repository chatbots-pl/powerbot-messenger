class Generic {
  constructor (title, subtitle, imageUrl, buttons, defaultAction) {
    if (typeof (title) === 'object') {
      const o = title
      this.title = o.title
      if (o.subtitle) this.subtitle = o.subtitle
      if (o.image_url) this.image_url = o.image_url
      if (o.buttons) this.buttons = o.buttons
      if (o.default_action) this.default_action = o.default_action
    } else {
      this.title = title
      if (subtitle) this.subtitle = subtitle
      if (imageUrl) this.image_url = imageUrl
      if (buttons) this.buttons = buttons
      if (defaultAction) this.default_action = defaultAction
    }
  }
}

module.exports = Generic
