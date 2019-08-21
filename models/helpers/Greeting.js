class Greeting {
  constructor (text, locale) {
    locale = locale || 'default'
    this.greeting = []

    if (typeof (text) === 'string') {
      this.greeting.push({
        locale: locale,
        text: text
      })
    } else if (typeof (text) === 'object') {
      this.greeting = text
    }
  }
}

module.exports = Greeting
