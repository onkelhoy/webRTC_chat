const express     = require('express')
const dotenv      = require('dotenv')
const http        = require('http')
const app = express()
const server = http.createServer(app)

// init the websocket server
require('./index.js')(server)
dotenv.config()


server.listen(process.env.PORT, function () {
  console.log('running on ' + process.env.PORT)
})
