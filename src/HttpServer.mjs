
// src/HttpServer.mjs

import { createServer } from 'node:http'
import { createSecureServer } from 'node:http2'
import { setuid, setgid } from 'node:process'
import Route from './Route.mjs'
import Middleware from './Middleware.mjs'
import { isString, isFunction } from './utils.mjs'

export default class HttpServer {

  #server
  #stack = []
  #settings = {}

  constructor({ cert, key, uid, gid } = {}) {
    this.#settings.cert = cert
    this.#settings.key = key
    this.#settings.uid = uid
    this.#settings.gid = gid
  }

  use(path, ...handlers) {
    const route = new Middleware({ path, handlers })
    this.#stack.push(route)
    return this
  }

  get(path, ...handlers) {
    const route = new Route({ method: 'GET', path, handlers })
    this.#stack.push(route)
    return this
  }

  post(path, ...handlers) {
    const route = new Route({ method: 'POST', path, handlers })
    this.#stack.push(route)
    return this
  }

  listen(port, ...args) {

    this.#settings.port = port

    if (isString(args[0])) {
      this.#settings.host = args[0]
    }

    if (this.isSecure) {

      this.#server = createSecureServer({
        cert: this.cert,
        key: this.key,
        allowHTTP1: true,
      }, this.handle.bind(this))

      if (port === 443) {
        const redirectServer = createServer((request, response) => {
          const { url } = request
          const { host } = request.headers
          const hostname = host
            ? host.replace(/:\d+$/, '')
            : 'localhost'
          const location = `https://${ hostname }${ url }`
          response.writeHead(301, { 'Location': location })
          response.end()
        })

        if (this.host) {
          redirectServer.listen(80, this.host, () => {
            console.log(
              `server: redirect server start listen on port 80`
            )
          })
        } else {
          redirectServer.listen(80, () => {
            console.log(
              `server: redirect server start listen on port 80`
            )
          })
        }

      }

    } else {
      this.#server = createServer(this.handle.bind(this))
    }

    const userCallback = args.find(isFunction)

    const listenCallback = () => {

      if (this.port < 1024) {
        const uid = this.uid || 1000
        const gid = this.gid || uid
        try {
          setgid(gid)
          setuid(uid)
          console.log(
            `server: privileges dropped to uid=${ uid }, gid=${ gid } `
          )
        } catch (error) {
          console.error(
            `server: failed to drop privileges: `, error
          )
        }
      }

      if (isFunction(userCallback)) {
        userCallback()
      }

    }

    return this.host
      ? this.#server.listen(port, this.host, listenCallback)
      : this.#server.listen(port, listenCallback)

  }

  handle(request, response) {

    const { method } = request
    const url = new URL(
      request.url,
      `${ this.isSecure ? 'https' : 'http' }://`
        + `${ this.host ?? 'localhost' }`
    )
    const path = url.pathname

    const stack = this.#stack
    let index = 0
    next()

    function next() {

      if (index >= stack.length) return
      const layer = stack[index++]

      if (
        layer instanceof Middleware
        && layer.match(path)
      ) {
        for (const handler of layer.handlers) {
          handler(request, response, next)
        }
      }

      else if (
        layer instanceof Route
        && layer.match(method, path)
      ) {
        for (const handler of layer.handlers) {
          handler(request, response)
        }
      }

      else {
        next()
      }

    }

  }

  get isSecure() {
    return this.#settings.cert
        && this.#settings.key
  }

  get port() {
    return this.#settings.port
  }

  get cert() {
    return this.#settings.cert
  }

  get key() {
    return this.#settings.key
  }

  get uid() {
    return this.#settings.uid
  }

  get gid() {
    return this.#settings.gid
  }

}
