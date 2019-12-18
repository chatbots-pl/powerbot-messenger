const QuickReply = require('./helpers/QuickReply.js')
const Button = require('./helpers/Button.js')
const GetStartedButton = require('./helpers/GetStartedButton.js')
const Greeting = require('./helpers/Greeting.js')
const Generic = require('./helpers/Generic.js')
const Media = require('./helpers/Media.js')

class Helpers {
  constructor (sender) {
    this.QuickReply = QuickReply
    this.Button = Button
    this.GetStartedButton = GetStartedButton
    this.Greeting = Greeting
    this.Generic = Generic
    this.Media = Media
  }
}

module.exports = Helpers
