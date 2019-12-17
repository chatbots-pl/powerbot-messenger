const Router = require('koa-router')

const randomize = require('../modules/randomize')
const Logger = require('../modules/logger')
const Typer = require('./Typer')
const Sender = require('./Sender.js')
const CommentTools = require('./CommentTools.js')

const router = new Router()

let that = null

class Server {
  constructor (config, emitter) {
    this.config = config
    this.verify_token = randomize.string(10)
    this.emitter = emitter
    this.log = new Logger(this.config, 'server', emitter)
    this.typer = new Typer(config, emitter)
    that = this
  }

  init () {
    router.get(this.config.endpoint, (ctx) => {
      const mode = ctx.query['hub.mode']
      const token = ctx.query['hub.verify_token']
      const challenge = ctx.query['hub.challenge']

      if (!mode || !token) {
        this.log.warn('Webhook connection request without mode and/or token.')
        return ctx.throw(403, 'No data provided')
      }
      if (mode === 'subscribe' && token === this.verify_token) {
        this.log.info('Webhook connected!')
        ctx.body = challenge
      } else {
        this.log.warn('Webhook verification failed. Invalid verify token.')
        ctx.status = 403
      }
    })

    router.post(this.config.endpoint, (ctx) => {
      const body = ctx.request.body
      that.emitter.emit('request_incoming', body, ctx)
      if (body.object === 'page') {
        for (let i = 0; i < body.entry.length; i++) {
          const entry = body.entry[i]
          that.emitter.emit('entry', entry)
          if (entry.messaging) {
            for (let o = 0; o < entry.messaging.length; o++) {
              const message = entry.messaging[o]
              if (message.message && message.message.is_echo) {
                const m = {}
                m.text = message.message.text
                m.app_id = message.message.app_id
                m.timestamp = message.timestamp
                m.recipient_id = message.recipient.id
                m.reply = new Sender(that.config, message.recipient.id, that.emmiter)
                that.emitter.emit('echo', m, message)
                ctx.status = 200
                return
              }

              const m = {}
              m.sender_id = message.sender.id
              m.reply = new Sender(that.config, message.sender.id, that.emitter)
              m.timestamp = message.timestamp
              if (message.message && message.message.text) m.text = message.message.text

              that.emitter.emit('message', m, message)

              if (message.message && message.message.attachments) {
                message.message.attachments.map(attachment => {
                  if (attachment.type === 'location') {
                    m.location = attachment.payload.coordinates
                    that.emitter.emit('location', m, message)
                  } else if (attachment.type === 'image') {
                    m.url = attachment.payload.url
                    that.emitter.emit('image', m, message)
                  } else if (attachment.type === 'fallback') {
                    m.url = attachment.url
                    m.title = attachment.title
                    m.payload = attachment.payload
                    that.emitter.emit('fallback', m, message)
                  }
                })
              } else if (!message.message && message.postback) {
                m.payload = message.postback.payload
                that.emitter.emit('postback', m, message)
                that.emitter.emit('payload', m, message)
              } else if (message.message && message.message.quick_reply) {
                m.payload = message.message.quick_reply.payload
                that.emitter.emit('quick_reply', m, message)
                that.emitter.emit('payload', m, message)
              } else {
                that.emitter.emit('text', m, message)
              }
              if (that.config.mark_seen) that.typer.markSeen(m.sender_id)
            }
          } else if (entry.changes) {
            for (let p = 0; p < entry.changes.length; p++) {
              const change = entry.changes[p]
              that.emitter.emit('change', change)
              const o = {}
              o.user = change.value.from
              o.type = change.value.item
              o.created_time = change.value.created_time

              if (o.type === 'comment') {
                o.comment = {
                  text: change.value.message,
                  id: change.value.comment_id
                }
                o.tools = new CommentTools(that.config, o.comment, o.user, that.emitter)
                that.emitter.emit('comment', o, change)
              }
            }
          }
        }
        ctx.status = 200
      } else {
        ctx.status = 404
      }
    })

    // Timeout needed to set event listener outside this file
    setTimeout(function () {
      that.log.info(`Verify token: ${that.verify_token}`)
    }, 1000)

    return {
      bot: that.emitter,
      router
    }
  }
}

module.exports = Server
