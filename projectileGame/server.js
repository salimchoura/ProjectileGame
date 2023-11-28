const express = require('express')
const app = express()
app.use(express.static('public_html'))
app.listen(3000,() => {console.log('App is listening on port 3000')})