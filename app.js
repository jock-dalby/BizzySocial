const express = require('express')
const app = express()

app.get('/', function(req, res){
  res.send("Hello, I'm working")
})


// Exports app functions

module.exports = app
