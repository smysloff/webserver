
// file: src/Layer.mjs

import { isArray, isFunction, isString } from './utils.mjs'

export default class Layer {

  static checkPath(path) {
    if (!isString(path)) {
      throw new TypeError(
        `'path' must be a 'string' type`
      )
    }
    return path.toLowerCase()
  }

  static checkHandlers(handlers) {
    if (!isArray(handlers)) {
      throw new TypeError(
        `'handlers' must be an array of functions`
      )
    }
    handlers = handlers.flat()
    if (!handlers.every(isFunction)) {
      throw new TypeError(
        `every 'handler' must be a 'function' type`
      )
    }
    return handlers
  }

  #path
  #handlers

  get path() {
    return this.#path
  }

  get handlers() {
    return this.#handlers
  }

  constructor({ path, handlers }) {
    this.#path = Layer.checkPath(path)
    this.#handlers = Layer.checkHandlers(handlers)
  }

}
