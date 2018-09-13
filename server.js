const express     = require('express')
const dotenv      = require('dotenv')
const http        = require('http')
const app = express()
const server = http.createServer(app)

// init the websocket server
require('./routes/websocket.js')(server)
dotenv.config()

app.use('/static', express.static('./client/'))
app.use('/', require('./routes/index.js'))

server.listen(process.env.PORT, function () {
  console.log('running on ' + process.env.PORT)
})
