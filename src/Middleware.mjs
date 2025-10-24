
// file: src/Middleware.mjs

import Layer from './Layer.mjs'

export default class Middleware extends Layer {

  constructor({ path, handlers }) {
    super({ path, handlers })
  }

  match(path) {
    return this.#matchPath(path)
  }

  #matchPath(path) {
    path = Layer.checkPath(path)
    return path.startsWith(this.path)
  }

}
