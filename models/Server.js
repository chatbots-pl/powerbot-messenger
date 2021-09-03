const Router = require('koa-router')

const randomize = require('../modules/randomize')
const Logger = require('../modules/logger')
const Typer = require('./Typer')
const Sender = require('./Sender.js')
const CommentTools = require('./CommentTools.js')
const HandoverReply = require('./HandoverReply.js')

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

  _formHandoverData(message, handoverDataFieldName, appIdFieldName) {
    return {
      user_id: message.sender.id,
      timestamp: message.timestamp,
      handover: {
        app_id: message[handoverDataFieldName][appIdFieldName],
        metadata: message[handoverDataFieldName].metadata
      }
    }
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
                m.handover = new HandoverReply(this.config, this.emitter, message.recipient.id)
                that.emitter.emit('echo', m, message)
                ctx.status = 200
                return
              }

              if(message.pass_thread_control) {
                const m = this._formHandoverData(message, 'pass_thread_control', 'new_owner_app_id')
                that.emitter.emit('handover_thread_received', m, message)
                ctx.status = 200
                return
              } else if(message.take_thread_control) {
                const m = this._formHandoverData(message, 'take_thread_control', 'previous_owner_app_id')
                that.emitter.emit('handover_thread_taken', m, message)
                ctx.status = 200
                return
              } else if(message.request_thread_control) {
                const m = this._formHandoverData(message, 'request_thread_control', 'requested_owner_app_id')
                that.emitter.emit('handover_thread_requested', m, message)
                ctx.status = 200
                return
              } else if(message.app_roles) {
                const m = {
                  timestamp: message.timestamp,
                  roles: []
                }
                for(const k of Object.keys(message.app_roles)) {
                  m.roles.push({
                    app_id: k,
                    roles: message.app_roles[k]
                  })
                }
                that.emitter.emit('handover_roles_changed', m, message)
                ctx.status = 200
                return
              }

              const m = {}
              m.sender_id = message.sender.id
              m.reply = new Sender(that.config, message.sender.id, that.emitter)
              m.handover = new HandoverReply(this.config, this.emitter, message.sender.id)
              m.timestamp = message.timestamp
              if (message.message && message.message.text) m.text = message.message.text

              that.emitter.emit('message', m, message)

              if (message.read) {
                m.watermark = message.read.watermark
                that.emitter.emit('message_read', m, message)
              } else if (message.message && message.message.attachments) {
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
              } else if (m.text) {
                that.emitter.emit('text', m, message)
              } else if (message.referral) {
                m.referral = message.referral
                that.emitter.emit('referral', m, message)
              } else if (message.optin) {
                that.emitter.emit('optin', m, message)
                if (message.optin.type === 'one_time_notif_req') {
                  m.token = message.optin.one_time_notif_token
                  m.payload = message.optin.payload
                  that.emitter.emit('one_time_notif_req', m, message)
                }
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

              if (o.type === 'comment' && change.value.verb === 'add') {
                o.comment = {
                  text: change.value.message,
                  id: change.value.comment_id
                }
                o.tools = new CommentTools(that.config, o.comment, o.user, that.emitter) // DEPRACATED
                o.reply = new Sender(that.config, o.comment.id, that.emitter, 'comment_id')
                that.emitter.emit('comment', o, change)
              }

              if (o.type === 'post' && change.value.verb === 'add') {
                o.post = {
                  text: change.value.message,
                  id: change.value.post_id
                }
                o.reply = new Sender(that.config, o.post.id, that.emitter, 'post_id')
                that.emitter.emit('post', o, change)
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
