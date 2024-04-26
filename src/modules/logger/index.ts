import { EventEmitter } from "events";

export enum ELogLevel {
  OFF,
  ERROR,
  WARNING,
  INFO,
  DEBUG
}

export interface ILoggerConfig {
  logLevel: ELogLevel
  logToConsole: boolean
  moduleName: string
}

export interface ILoggerPayload {
  moduleName: string
  level: ELogLevel
  message: string
}

class Logger {
  private moduleName: string
  private logLevel: ELogLevel
  private logToConsole: boolean
  private emitter: EventEmitter

  constructor (config: ILoggerConfig, emitter: EventEmitter) {
    this.moduleName = config.moduleName
    this.logLevel = config.logLevel || ELogLevel.DEBUG
    this.logToConsole = config.logToConsole
    if (this.logToConsole === undefined) this.logToConsole = true
    this.emitter = emitter
  }

  debug (msg: string) {
    if (this.logLevel < ELogLevel.DEBUG) return
    const string = `[pb-messenger][${this.moduleName}][debug] ${msg}`
    const o: ILoggerPayload = {
      moduleName: this.moduleName,
      level: ELogLevel.DEBUG,
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  info (msg: string) {
    if (this.logLevel < ELogLevel.INFO) return
    const string = `[pb-messenger][${this.moduleName}][info] ${msg}`
    const o: ILoggerPayload = {
      moduleName: this.moduleName,
      level: ELogLevel.INFO,
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  warn (msg: string) {
    if (this.logLevel < ELogLevel.WARNING) return
    const string = `[pb-messenger][${this.moduleName}][warn] ${msg}`
    const o: ILoggerPayload = {
      moduleName: this.moduleName,
      level: ELogLevel.WARNING,
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  error (msg: string) {
    if (this.logLevel < ELogLevel.ERROR) return

    const string = `[pb-messenger][${this.moduleName}][error] ${msg}`
    const o: ILoggerPayload = {
      moduleName: this.moduleName,
      level: ELogLevel.ERROR,
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  logToConsoleFunction (str: string) {
    if (!this.logToConsole) return
    console.log(str)
  }

  emitEvent (o: ILoggerPayload) {
    this.emitter.emit('log', o)
  }
}

module.exports = Logger
