const WebSocket = require('ws')

let wss
module.exports = function (server) {
  wss = new WebSocket.Server({ server })
  wss.connections = 0
  setInterval(setPulse, 5000) // ping them every 5s

  // client socket connected to our server !
  wss.on('connection', socket => {
    wss.connections++
    socket.id = new Date().getTime() + Math.random()
    socket.onclose = disconnect.bind(null, socket)

    console.log('connected', socket.id)
    console.log('current connections', wss.connections)
    socket.send(JSON.stringify({ type: 'ack', ack: 'connection', id: socket.id }))
    socket.on('message', data => {
      data = JSON.parse(data)


      switch (data.type) {
        case 'ping':
          socket.ping_status = true; break;
        case 'register':
          register(data, socket); break;
        case 'disconnect':
          disconnect(socket); break;
        case 'offer':
        case 'reject':
        case 'answer':
        case 'candidate':
          sendTo(socket, data); break;
      }
    })
  })
}


// TODO: create a connect funciton that connects N clients togheter (with their rtc offers)
function sendTo (socket, data) {
  for (let client of wss.clients) {
    if (client.id === data.to.id) // finds the client we want to connect to
      return client.send(JSON.stringify(data)) // sends the data
  }

  // well we did not find it
  socket.send(JSON.stringify({type: 'error', message: 'Not found'}))
}

function register (data, socket) {
  if (!data.name || data.name && /\W/.test(data.name))
    return socket.send({ type: 'error', message: 'invalid name' })
  socket.name = data.name

  console.log('register', socket.id, socket.name)
  let others = []
  for (let client of wss.clients) {
    if (client.name) {
      let info = { name: socket.name, id: socket.id }
      others.push(info)
      client.send(JSON.stringify({ type: 'connect', info }))
    }
  }

  socket.send(JSON.stringify({ type: 'ack', ack: 'register', others }))
}

// TODO: this needs to be tested (if others gets the disconnect)
function disconnect (socket) {
  const data = JSON.stringify({ type: 'disconnect', id: socket.id })
  wss.connections--
  console.log('disconnected', socket.id, socket.name)
  console.log('current connections', wss.connections)

  if (socket.name)
    for (let client of wss.clients)
      client.send(data)
}
function setPulse () {
  for (let client of wss.clients) { // if its brand new its going to be undefined
    if (client.ping_status !== undefined && !client.ping_status) {
      console.log('unreachable', client.id, client.name)
      client.terminate()
      continue
    }

    client.ping_status = false
    client.send(JSON.stringify({ type: 'ping' }))
  }
}
