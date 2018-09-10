const WebSocket = require('ws')

const connections = []
module.exports = function (server) {
  const wss = new WebSocket.Server({ server })

  // client socket connected to our server !
  wss.on('connection', socket => {
    socket.on('register', client_info => {
      if (!client_info.name || /\W/.test(client_info.name))
        return socket.send({ error: 'invalid name' })

      client_info.id = 'id#' + Math.round(Math.random()*100000)
      connections.push(client_info)

      console.log(wss.clients)
      socket.send({ id: client_info.id, others: connections })
    })

    wss.on('disconnect')
  })
}





/*

// GET
route.get('/test', (req, res) => res.end('hello'))
route.get('/connections', (req, res) => res.json(connections))

// POST
route.post('/register', (req, res) => {
  if (!req.body.name || /\W/.test(req.body.name))
    return res.status(406).end('invalid name')

  req.body.id = 'id#' + Math.round(Math.random()*100000)
  connections.push(req.body)

  res.status(200).end(req.body.id)
})
route.post('/connect', (req, res) => {
  if (!req.body.offer)
    return res.status(406).end('give me an offer I cant resist')

})
route.post('/removeme', (req, res) => {
  let id = req.body.id

  let index = connections.findIndex(c => c.id === id)
  if (index === -1)
    return res.status(404).end('not found')

  connections.splice(index, 1)
  res.status(200).end('removed')
})

module.exports = route
*/
