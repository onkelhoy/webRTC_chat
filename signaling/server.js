let express = require('express')
let app = express()

app.get('/test', (req, res) => res.end('hello'))

app.listen(function () {
  console.log('running on 3000')
}, 3000)
