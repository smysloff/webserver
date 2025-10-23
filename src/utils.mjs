
// file: src/utils.mjs

const { isArray } = Array

export { isArray }

export function isFunction(data) {
  return typeof data === 'function'
}

export function isPromise(data) {
  return data instanceof Promise
}

export function isString(data) {
  return typeof data === 'string'
      || data instanceof String
}

export function getReadableIP(ip) {
  return ip?.startsWith('::ffff:')
    ? ip.substring(7)
    : ip
}
