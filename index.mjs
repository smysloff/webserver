
// file: index.mjs

import { readFile } from 'node:fs/promises'
import HttpServer from './src/HttpServer.mjs'
import { getReadableIP } from './src/utils.mjs'

const options = {
  cert: await readFile('ssl/localhost-cert.pem'),
  key: await readFile('ssl/localhost-privkey.pem'),
  uid: 'smysloff',
  gid: 'smysloff',
}

const server = new HttpServer(options)

server.use('/', (request, response, next) => {
  const addr = getReadableIP(request.socket.remoteAddress)
  const port = request.socket.remotePort
  const { url, method } = request
  const client = `${ addr }:${ port }`
  console.log(`${ client }: ${ method } ${ url }`)
  next()
})

server.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello, World!')
})

server.use('/', (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/plain' })
  response.end('Error 404: Page Not Found')
})

server.listen(443, '0.0.0.0', () => {
  console.log(`server: start listen on port ${ server.port }`)
})

