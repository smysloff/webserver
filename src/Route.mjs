
// file: src/Route.mjs

import Layer from './Layer.mjs'
import { isString } from './utils.mjs'

export default class Route extends Layer {

  static checkMethod(method) {
    if (!isString(method)) {
      throw new TypeError(
        `'method' must be a 'string' type`
      )
    }
    return method.toUpperCase()
  }

  #method

  get method() {
    return this.#method
  }

  constructor({ method, path, handlers }) {
    super({ path, handlers })
    this.#method = Route.checkMethod(method)
  }

  match(method, path) {
    return this.#matchMethod(method)
        && this.#matchPath(path) 
  }

  #matchMethod(method) {
    method = Route.checkMethod(method)
    return this.method === method
  }

  #matchPath(path) {
    path = Route.checkPath(path)
    return this.path === path
  }

}
