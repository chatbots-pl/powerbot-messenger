// TODO: This should be typed with https://www.npmjs.com/package/typed-emitter
import { EventEmitter } from 'events'
class Emitter extends EventEmitter {}
const emitter = new Emitter()

export default emitter
