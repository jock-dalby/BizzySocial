const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const _ = require('lodash')
const knex = require('knex')(require('./knexfile').development)

const db = require('./db/db.js')

//setup
app.use(bodyParser.urlencoded({extended:false}))

// view engine setup
app.engine('hbs', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'hbs')

// serve the files in /public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.get('/', function(req, res){
  res.render('login', {title:"Bizzy Login"})
})

app.get('/register', function(req, res){
  res.render('register', {title:"Bizzy Page"})
})


// Log-In

app.post('/bizzyprofile', function(req, res) {
  db.findUserByName('users', req.body.name, function(err, user) {
    if (err) {
      res.send("ERROR")
    } else {
      res.render('profile', {user: user})
    }
  })
})

// Register

app.post('/register/success', function(req, res) {
  db.addNewUser('users', req.body, function(err,user) {
    if(err) {
      console.log(err)
      res.send("ERROR")
    } else {
      res.render('profile', {user: user})
    }
  })
})

// Exports app functions
module.exports = app
