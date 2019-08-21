const levelsNumbers = {
  debug: 4,
  info: 3,
  warning: 2,
  error: 1,
  off: 0
}

class Logger {
  constructor (config, moduleName, emitter) {
    this.moduleName = moduleName
    this.logLevel = config.log_level || 'debug'
    this.logToConsole = config.log_to_console
    if (this.logToConsole === undefined) this.logToConsole = true
    this.logLevelN = levelsNumbers[this.logLevel]
    this.emitter = emitter
  }

  debug (msg) {
    if (this.logLevelN < levelsNumbers.debug) return
    const string = `[pb-messenger][${this.moduleName}][debug] ${msg}`
    const o = {
      moduleName: this.moduleName,
      level: 'debug',
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  info (msg) {
    if (this.logLevelN < levelsNumbers.info) return
    const string = `[pb-messenger][${this.moduleName}][info] ${msg}`
    const o = {
      moduleName: this.moduleName,
      level: 'info',
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  warn (msg) {
    if (this.logLevelN < levelsNumbers.warning) return
    const string = `[pb-messenger][${this.moduleName}][warn] ${msg}`
    const o = {
      moduleName: this.moduleName,
      level: 'warn',
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  error (msg) {
    if (this.logLevelN < levelsNumbers.error) return

    const string = `[pb-messenger][${this.moduleName}][error] ${msg}`
    const o = {
      moduleName: this.moduleName,
      level: 'error',
      message: msg
    }
    this.emitEvent(o)
    this.logToConsoleFunction(string)
  }

  logToConsoleFunction (str) {
    if (!this.logToConsole) return
    console.log(str)
  }

  emitEvent (o) {
    this.emitter.emit('log', o)
  }
}

module.exports = Logger
