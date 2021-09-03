# Powerbot Messenger 🤖

- [Powerbot Messenger 🤖](#powerbot-messenger---)
  * [Including](#including)
      - [Configuration options](#configuration-options)
  * [Server](#server)
    + [Starting server](#starting-server)
    + [Catching events](#catching-events)
    + [Server events](#server-events)
    + [Formed Message vs Raw Message](#formed-message-vs-raw-message)
  * [Sender](#sender)
    + [Methods](#methods)
      - [`text(message, options)`](#-text-message--options--)
      - [`quickReplies(message, replies, options)`](#-quickreplies-message--replies--options--)
      - [`buttons(text, buttons, options)`](#-buttons-text--buttons--options--)
      - [`attachment(type, url, options)`](#-attachment-type--url--options--)
      - [`generic(elements, options)`](#-generic-elements--options--)
      - [`media(element, options)`](#-media-element--options--)
      - [`oneTimeNotificationRequest (title, payload, options)`](#-onetimenotificationrequest--title--payload--options--)
  * [Helpers](#helpers)
    + [Button](#button)
    + [Generic Message](#generic-message)
    + [Media Message](#media-message)
    + [Get Started Button](#get-started-button)
    + [Greeting](#greeting)
    + [Quick Reply](#quick-reply)
  * [User object](#user-object)
    + [Get user data](#get-user-data)
    + [Send message](#send-message)
  * [Static elements](#static-elements)
    + [`pbm.send.setting(data)`](#-pbmsendsetting-data--)
      - [Greeting](#greeting-1)
      - [Get Started Button](#get-started-button-1)
      - [Persistent Menu](#persistent-menu)
  * [Personas](#personas)
    + [Creating persona](#creating-persona)
    + [Deleting persona](#deleting-persona)
    + [Using persona with reply method](#using-persona-with-reply-method)
    + [Using persona with Frame class](#using-persona-with-frame-class)
  * [Natural typing](#natural-typing)
  * [Generator Module](#generator-module)
    + [Supported types](#supported-types)
      - [Text](#text)
      - [Quick Replies](#quick-replies)
      - [Buttons](#buttons)
      - [Generic](#generic)
      - [Media](#media)
      - [One Time Notification Request](#one-time-notification-request)
    + [Frame class](#frame-class)
      - [`options`](#-options-)
      - [Normal response](#normal-response)
      - [Message tag](#message-tag)
      - [Message tag shorthand](#message-tag-shorthand)
  * [Handover Protocol](#handover-protocol)
    + [Pass Thread Control](#pass-thread-control)
    + [Take Thread Control](#take-thread-control)
    + [Request Thread Control](#request-thread-control)
    + [Secondary Receivers List](#secondary-receivers-list)
    + [Thread Owner](#thread-owner)
    + [Handover methods as reply](#handover-methods-as-reply)
      - [**Important notice**](#--important-notice--)
  * [Comments & Posts reactions](#comments---posts-reactions)
    + [Reply to comment](#reply-to-comment)
    + [Reply to post](#reply-to-post)
  * [Uploader module](#uploader-module)
    + [Upload from URL](#upload-from-url)
  * [Examples](#examples)
    + [Echo bot full example](#echo-bot-full-example)
  * [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

## Including

```javascript
const PowerbotMessenger = require('@chatbots-pl/powerbot-messenger')
const pbm = new PowerbotMessenger({
    access_token: config.facebook.access_token
})
```

Configuration object should be passed like `new PowerbotMessenger(configObject)`.

#### Configuration options

| Name                   | Descrition                                                   | Type   | Default    |
|------------------------|--------------------------------------------------------------|--------|------------|
| `access_token`         | App's access token for desired page                          | string | null       |
| `api_version`          | Graph API version to use inrequests                          | string | 'v5.0'     |
| `endpoint`             | Sets endpoint to listen on                                   | string | '/webhook' |
| `log_level`            | Logging level, one of: debug, info, warning, error or off    | string | 'debug'    |
| `log_to_console`       | Enables or disables Powerbot Messenger logger console output | bool   | true       |
| `mark_seen`            | Automatically check received messages as seen                | bool   | true       |
| `natural_typing_speed` | Speed of message typing in characters per second             | int    | 50         |
| `natural_typing`       | Enable or disable natural typing feature                     | bool   | true       |

## Server

### Starting server

```javascript
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const PowerbotMessenger = require('@chatbots-pl/powerbot-messenger')
const pbm = new PowerbotMessenger(config)
const app = new Koa()

const messengerWebhook = pbm.Server.init()

app.use(bodyParser())
app.use(messengerWebhook.router.routes())

app.listen(3000)

```

Now server is listening on `/webhook`. Your console should display your verify token.
**Server always returns status 200 to facebook!**

`pbm.Server.init()` returns object which contains server and bot properties.

`routes` property is passed from PowerbotMessenger Koa Router instance.

`bot` property is event listener which is designed to catch server events.

### Catching events

Catching events after starting a server is as simple as:

```javascript
bot.on('text', async (message, raw) => {
    ...
})
```

### Server events

| Event                     | Description                                                                | Passed parameters             |
|---------------------------|----------------------------------------------------------------------------|-------------------------------|
| request_incoming          | Every request to your webhook                                              | `body`, `ctx`                 |
| request_outgoing          | Every request sent from bot via Powerbot Messenger library                 | `body`, `ctx`                 |
| log                       | Any log from Powerbot Messenger (except throwed errors)                    | `logObject`                   |
| message_sent              | Every message sent from bot via Powerbot Messenger library                 | `body`, `ctx`                 |
| entry                     | Each entry in received object                                              | `entry`                       |
| echo                      | Any message sent by bot (every message with `is_echo: true`)               | `formedMessage`, `rawMessage` |
| message                   | Any message received (each object of `entry.messaging`)                    | `formedMessage`, `rawMessage` |
| text                      | Text message received                                                      | `formedMessage`, `rawMessage` |
| location                  | Each message attachment with `type: 'location'`                            | `formedMessage`, `rawMessage` |
| image                     | Each message attachment with `type: 'image'`                               | `formedMessage`, `rawMessage` |
| fallback                  | Each message attachment not recognized by messenger platform               | `formedMessage`, `rawMessage` |
| payload                   | Any payload received (button or quick reply)                               | `formedMessage`, `rawMessage` |
| postback                  | Payload from button reveived                                               | `formedMessage`, `rawMessage` |
| quick_reply               | Payload from quick reply received                                          | `formedMessage`, `rawMessage` |
| referral                  | Referral received from m.me link                                           | `formedMessage`, `rawMessage` |
| change                    | Each change in received object (ex. new comment on page)                   | `rawChange`                   |
| comment                   | New comment created on page                                                | `formedChange`, `rawChange`   |
| post                      | New user post created on page                                              | `formedChange`, `rawChange`   |
| optin                     | Each message containing optin property                                     | `formedMessage`, `rawMessage` |
| one_time_notif_req        | Each message containing token for One Time Notification                    | `formedMessage`, `rawMessage` |
| message_read              | Each request with information about message read                           | `formedMessage`, `rawMessage` |
| handover_thread_received  | Chatbot received thread ownership for a user                               | `formedMessage`, `rawMessage` |
| handover_thread_taken     | Thread ownership for a user has been taken away by another application     | `formedMessage`, `rawMessage` |
| handover_thread_requested | Some app asks to take thread ownership for a user.                         | `formedMessage`, `rawMessage` |
| handover_roles_changed    | Administrator of connected page changed Handover Protocol role of chatbot. | `formedMessage`, `rawMessage` |



### Formed Message vs Raw Message

As you probably noticed in table above,a lot of events have passed data named `formedMessage` and `rawMessage`. First object is object created by Powerbot Messenger library containing most useful informations like sender, type or content. It also contains `reply` (and `handover`, check [Handover methods as reply](#handover-methods-as-reply) for more information) object which allows you to reply to the message sender without passing recipient id. Second object is unmodified object received from Messenger Platform.

### Replying to handover events

Handover events that with associated user id (`handover_thread_*`) are treated like messaging events. This means, that first parameter of event callback has `reply` and `handover` fields.

#### Usage example
For example, some app wants to take thread control to talk with user. You want to inform user about this and then pass thread control to this app:
```javascript
bot.on('handover_thread_requested', async (ev, raw) => {
  try {
    await ev.reply.text('Some app wants to talk to you, passing thread control...')
    await ev.handover.passThreadControl('263902037430900')
  } catch(e) {
    console.error(e)
  }
})
```

## Sender

```javascript
pbm.send.METHOD()
// OR
message.reply.METHOD()
```

Each method last parameter is option parameter, which is object. In this object you can pass recipient_id and messaging_type. (Options object will be propably changed soon)

It's recommended to use sender with Powerbot Messenger helpers which allows you to create messeges in a clean way.

All examples below are presented as replying to message

### Methods

#### `text(message, options)`

Sends text to client

```javascript
await message.reply.text('Your message')
```

#### `quickReplies(message, replies, options)`

Sends quick replies to client.

```javascript
let qrs = [
  new pbm.Helpers.QuickReply('text', 'Yes', 'ANSWER_YES')
  new pbm.Helpers.QuickReply('text', 'No', 'ANSWER_NO')
]
await message.reply.quickReplies('Your message', qrs)
```

#### `buttons(text, buttons, options)`

Sends buttons template to user

```javascript
let buttons = [
  new pbm.Helpers.Button('postback', 'Some postback', 'POSTBACK')
  new pbm.Helpers.Button('web_url', 'Some link', 'http://example.com')
]
await message.reply.buttons('Your message', buttons)
```

#### `attachment(type, url, options)`

Sends attachment to user

```javascript
await message.reply.attachment('image', 'https://example.com/assets/image.png')
```

#### `generic(elements, options)`

Sends generic template to user.

```javascript
let buttons = [
    new pbm.Helpers.Button('postback', 'Button no.1', 'PAYLOAD'),
    new pbm.Helpers.Button('web_url', 'Button no.2', 'https://example.com/')
  ]

let card1 = {
  title: 'Card One',
  subtitle: 'Subtitle no. 1',
  image_url: 'https://example.com/images/1.png',
  buttons: buttons
}

let cards = [
  new pbm.Helpers.Generic(card1),
  new pbm.Helpers.Generic('Card Two', 'Subtitle no.2', 'https://example.com/images/2.png', buttons)

]
await message.reply.generic(cards)
```

#### `media(element, options)`

Sends media element to user

```javascript
  const o = {
    buttons: [new pbm.Helpers.Button('web_url', 'URL', '<URL_ADDRESS>'), new pbm.Helpers.Button('postback', 'PAYLOAD', '<DEV_PAYLOAD>')],
    url: '<URL_TO_MEDIA>',
    media_type: 'image'
  }

  await message.reply.media(o)
```

#### `oneTimeNotificationRequest (title, payload, options)`

Sends One Time Notification request to user

```javascript
  await message.reply.oneTimeNotificationRequest('Get notified when something happened...', 'MY_PAYLOAD')
```

## Helpers

Using helpers is the easiest way to send desired message to facebook. Helpers are returning object for

### Button

Actually, this helper supports following types of buttons:

-   postback
-   web_url
-   phone_number
-   element_share

`new pbm.Helpers.Button(type, title, payload)`

```javascript
  let postback = new pbm.Helpers.Button('postback', 'Send Payload', 'PAYLOAD')
  let web_url = new pbm.Helpers.Button('web_url', 'Go', 'https://example.com/')
  let phone_number = new pbm.Helpers.Button('phone_number', 'Call Us', '+15105559999')
  let share = new pbm.Helpers.Button('element_share')
  let login = new pbm.Helpers.Button('account_link', 'https://example.com/auth')
  let logout = new pbm.Helpers.Button('account_unlink')
```

### Generic Message

As first argument of generic message helper you can pass object or string.

`new pbm.Helpers.Generic(title, subtitle, image_url, buttons, default_action)`

```javascript
let card1 = {
  title: 'Card One',
  subtitle: 'Subtitle no. 1',
  image_url: 'https://example.com/images/1.png',
  buttons: [...]
}

let cards = [
  new pbm.Helpers.Generic(card1),
  new pbm.Helpers.Generic('Card Two', 'Subtitle no.2', 'image_url', buttons)
]
```

### Media Message
As first argument of media message helper you can pass object or string.

`new pbm.Helpers.Media(type, url|attachemnt_id, buttons)`

```javascript
  const o = {
    buttons: [new pbm.Helpers.Button('web_url', 'URL', '<URL_ADDRESS>'), new pbm.Helpers.Button('postback', 'PAYLOAD', '<DEV_PAYLOAD>')],
    url: '<URL_TO_MEDIA>',
    media_type: 'image'
  }
    
  const m = new pbm.Helpers.Media(o) // Single media element, this is automatically wrapped in normal usage
```

### Get Started Button

As argument you can pass own paylod, default payload is 'GET_STARTED'.

`new pbm.Helpers.GetStartedButton(payload)`

```javascript
let get_started = new bot.Helpers.GetStartedButton('OWN_PAYLOAD')
```

### Greeting

You can pass locale string as second argument, default locale string: default

`new pbm.Helpers.Greeting(text, locale)`

```javascript
let greeting = new bot.Helpers.Greeting('Greeting text', 'zh_CN')
```

### Quick Reply

`new pbm.Helpers.QuickReply(type, title, payload, image_url)`

```javascript
let qr = new bot.Helpers.QuickReply('text', 'Start!', 'START')
```

## User object

`pbm.User(messenger_id)` allows to perform some basic operations on specific user.

### Get user data

You can fetch user data like `first_name`, `gender`, etc with `.getData(...fields)` method.

```javascript
let data = awiat pbm.User(this.data.messenger_id).getData('first_name', 'last_name', 'id')
```

**Attention!**
Remember that for some fields like gender you need special permissions from facebook, unless your request will fail with status code 400!

### Send message

You can send message directly to messenger id using User's send object. The rules are the same as using send or reply object.

```javascript
const user = pbm.User(message.sender_id)
await user.send.text('Hi!')
```

### Manage user's thread with Handover Protocol

You can call handover methods for managing thread with `User` object:
```javascript
const user = pbm.User(message.sender_id)

// Pass user's thread control to another app:
await user.handover.passThreadControl(123456789, 'optional metadata')

// Request user's thread control:
await user.handover.requestThreadControl('optional metadata')

// Take control over user's thread:
await user.handover.takeThreadControl('optional metadata')
```

## Static elements

Powerbot Messenger allows you to easily set static elements of your bot, like Get Started Button, Greeting text or persistent menu.

### `pbm.send.setting(data)`

This function allows you to send any object to graph apip `/me/messenger_profile` endpoint. To easily send basic elements to API use Helpers as shown below.

#### Greeting

```javascript
let greeting = new bot.Helpers.Greeting('This is greeting text!')
await pbm.send.setting(greeting)
```

#### Get Started Button

```javascript
let get_started = new bot.Helpers.GetStartedButton()
await pbm.send.setting(get_started)
```

#### Persistent Menu

Actually, Powerbot Messenger hasn't got any helper for menu, so you have to craft menu object on your own and then send it.

```javascript
let menu = {
    persistent_menu: [{
        locale: "default",
        call_to_actions: [{
            title: "Options",
            type: "postback",
            payload: "OPTIONS"
        }]
    }]
}

await pbm.send.setting(menu)
```

## Personas

Powerbot supports Personas API since version v1.1.0. Library can create and delete personas and utilize them with sender module.

### Creating persona
```javascript
  const personaId = await pbm.personas.create('Persona name', '<IMAGE_URL>')
```

### Deleting persona
```javascript
  await pbm.personas.delete('<IMAGE_URL>')
```

### Using persona with reply method
```javascript
    await message.reply.attachment('image', '<ATTACHMENT_URL|ATTACHMENT_ID>', { persona_id: '<PERSONA_ID>' })
```

### Using persona with Frame class
```javascript
    const message = new pbm.Message.Text('Text message created with Generator class')
    const framedMessage = new pbm.Frame(message, '1489852771114961', {
      persona_id: '<PERSONA_ID>'
    })
    await pbm.send.raw(framedMessage)
```


## Natural typing

Powerbot Messenger by default sets timeout to your messages that contiant text and displays typing animation to client. This feature is turned on by default and can be configured vie config object passed to Powerbot Messenger instance.

## Generator Module

Generator module was created to easily create messages for Broadcast API Creative Messages, but it can be also used to create advanced or unusual messages that are not covered by send methods and helpers. In brief, generator return message in facebook format which you can edit.

Generator module is accessible as Message object (`pbm.Message`)

### Supported types

#### Text

`pbm.Message.Text(text, options)`

```javascript
const message = new pbm.Message.Text('This is message created with generator module')
```

#### Quick Replies

`pbm.Message.QuickReplies(text, replies, options)`

```javascript
const replies = [
  new pbm.Helpers.QuickReply('text', 'Super', 'PAYLOAD_1'),
  new pbm.Helpers.QuickReply('text', 'Ok', 'PAYLOAD_2')
]

const message = new pbm.Message.QuickReplies('This is message created with generator module', replies)
```

#### Buttons

`pbm.Message.Buttons(text, buttons, quick_replies, options)`

If quick_replies parameter is not an array it's interpreted as options object!

```javascript
const buttons = [
  new pbm.Helpers.Button('postback', 'Button 1', 'PAYLOAD_1'),
  new pbm.Helpers.Button('postback', 'Button 2', 'PAYLOAD_2')
]

const message = new pbm.Message.QuickReplies('This is message created with generator module', buttons)
```

#### Generic

`pbm.Message.Generic(elements, options)`

```javascript
const card = {
  title: 'Card',
  subtitle: 'Subtitle',
  image_url: 'https://example.com/images/1.png',
  buttons: [...]
}

const cards = [card, card, card]

const message = new pbm.Message.Generic(cards)
```

#### Media

`pbm.Message.Media(element, options)`

```javascript
  const o = {
    buttons: [new pbm.Helpers.Button('web_url', 'URL', '<URL_ADDRESS>'), new pbm.Helpers.Button('postback', 'PAYLOAD', '<DEV_PAYLOAD>')],
    url: '<URL_TO_MEDIA>',
    media_type: 'image'
  }
    
  const m = new pbm.Helpers.Media(o) // Single media element, this is automatically wrapped in normal usage
  const message = new pbm.Message.Media(m) // Wrapped here
```

#### One Time Notification Request

`pbm.Message.oneTimeNotificationRequest (title, payload, options)`

```javascript
  const message = new pbm.Message.oneTimeNotificationRequest('Get notified when something happened...', 'MY_PAYLOAD')
```

### Frame class

`pbm.Frame(message, recipient_id, options)`

Above examples of supported messages shows how to use Generator module. Any generator returns only message body. It means that there isn's recipient object etc and message is **compatible only with Broadcast API Creative Message (which is depracated now)**. If you want to send message from creator as reply to message you will have to use MessageFrame class, which is accessible as `pbm.Frame`

When message is in frame you can send it using `pbm.send.raw()` or `message.reply.raw()` (if reply object is available). This is exactly the same, because message in frame has already defined recipient id.

#### `options`
| Option         | Type   | Description                                                |
|----------------|--------|------------------------------------------------------------|
| messaging_type | String | Messaging type param, if desired other than 'RESPONSE'     |
| tag            | String | Message tag in case of messaging_type set to 'MESSAGE_TAG' |

As options you can pass also string, which will be treated as `tag`. In that case, messaging_type will be automatically set to 'MESSAGE_TAG'.

#### Normal response
```javascript
const message = new pbm.Message.Text('Text message created with Generator class')
const framedMessage = new pbm.Frame(message, '1489852771114961')
await pbm.send.raw(framedMessage)
```

#### Message tag
```javascript
const message = new pbm.Message.Text('Text message created with Generator class')
const framedMessage = new pbm.Frame(message, '1489852771114961', {
  messaging_type: 'MESSAGE_TAG',
  tag: 'NON_PROMOTIONAL_SUBSCRIPTION'
})
await pbm.send.raw(framedMessage)
```

#### Message tag shorthand
```javascript
const message = new pbm.Message.Text('Text message created with Generator class')
const framedMessage = new pbm.Frame(message, '1489852771114961', 'NON_PROMOTIONAL_SUBSCRIPTION')
await pbm.send.raw(framedMessage)
```

## Handover Protocol
Powerbot handles requests to handover protocol API. Assume that `message` in all of the following examples is `message` object received in `.on('text')`

### Pass Thread Control
`pbm.handover.passControl(appId, userId, metadata)`
```javascript
await pbm.handover.passControl(123456789, message.sender_id)
// Or with metadata:
await pbm.handover.passControl(123456789, message.sender_id, 'some data here')
```

### Take Thread Control
`pbm.handover.takeControl(userId, metadata)`
```javascript
await pbm.handover.takeControl(message.sender_id)
// Or with metadata:
await pbm.handover.takeControl(message.sender_id, 'some data here')
```

### Request Thread Control
`pbm.handover.requestControl(userId, metadata)`
```javascript
await pbm.handover.requestControl(message.sender_id)
// Or with metadata:
await pbm.handover.requestControl(message.sender_id, 'some data here')
```

### Secondary Receivers List
`pbm.handover.getSecondaryReceivers(...fields)`
```javascript
const data = await pbm.handover.getSecondaryReceivers()
// Or with fileds:
const another = await pbm.handover.getSecondaryReceivers('id', 'name')
```

### Thread Owner
`pbm.handover.getOwner(userId)`
```javascript
const data = await pbm.handover.getOwner(message.sender_id)
```

### Handover methods as reply
Listed below methods are available as reply to incoming messages (just like `message.reply`).

```javascript
// Pass sender's thread control to another app:
await message.handover.passThreadControl(123456789, 'optional metadata')

// Request sender's thread control:
await message.handover.requestThreadControl('optional metadata')

// Take control over sender's thread:
await message.handover.takeThreadControl('optional metadata')
```

#### **Important notice**
In some cases handover reply object can be supplied without recipient_id. In such case above functions will throw Graph API Error.

## Comments & Posts reactions

You can receive and reply to comments and posts created on your fanpage. Of corse you will need `manage_pages` permission and `feed` activated for your webhook.

Powerbot has 2 events to perform that actions - `comment` and `post`. Reply method of both supports all messages types available in `Sender` class.

### Reply to comment
```javascript
bot.on('comment', async comment => {
  await comment.reply.buttons('Comment message with buttons', [new pbMessenger.Helpers.Button('postback', 'Button title', '<PAYLOAD>')])
})
```

### Reply to post
```javascript
bot.on('post', async post => {
  await post.reply.buttons('post message with buttons', [new pbMessenger.Helpers.Button('postback', 'Button title', '<PAYLOAD>')])
})
```

## Uploader module

Module for uploading attachments via Attachments API

### Upload from URL

`pbm.upload.fromUrl(type, url)`

Sends attachment upload request and return uploaded attachment ID. Type param must be supported by Attachments API.

## Examples

### Echo bot full example

```javascript
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const PowerbotMessenger = require('@chatbots-pl/powerbot-messenger')

const pbm = new PowerbotMessenger({
  access_token: '<ACCESS_TOKEN>'
})
const app = new Koa()
const messengerWebhook = pbm.Server.init()

const bot = messengerWebhook.bot

bot.on('message', async (message) => {
  try {
    await message.reply.text(message.text)
  } catch (e) {
    console.error(e)
  }
})

app.use(bodyParser())
app.use(messengerWebhook.router.routes())

app.listen(3000)

```

## License

This software is licensed under MIT License.