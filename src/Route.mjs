
// file: src/Route.mjs

import { isArray, isFunction, isString } from './utils.mjs'

export default class Route {

  static checkMethod(method) {
    if (!isString(method)) {
      throw new TypeError(`'method' must be a 'string' type`)
    }
    return method.toUpperCase()
  }

  static checkPath(path) {
    if (!isString(path)) {
      throw new TypeError(`'path' must be a 'string' type`)
    }
    return path
  }

  static checkHandlers(handlers) {
    if (!isArray(handlers)) {
      throw new TypeError(`'handlers' must be an array of functions`)
    }
    handlers = handlers.flat()
    if (!handlers.every(isFunction)) {
      throw new TypeError(`every 'handler' must be a 'function' type`)
    }
    return handlers
  }

  #method
  #path
  #handlers

  constructor({ method, path, handlers }) {
    this.#method = Route.checkMethod(method)
    this.#path = Route.checkPath(path)
    this.#handlers = Route.checkHandlers(handlers)
  }

  match(method, path) {
    return this.#matchMethod(method)
        && this.#matchPath(path) 
  }

  #matchMethod(method) {
    method = Route.checkMethod(method)
    return this.#method === method
  }

  #matchPath(path) {
    path = Route.checkPath(path)
    return this.#path === path
  }

  get handlers() {
    return this.#handlers
  }

}
