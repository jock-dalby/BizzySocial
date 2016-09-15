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
  var userName = req.body.userName
  db.findUserByResource('userName', userName, function(err, user) {
    if (err) {
      res.render('error')
    } else {
      res.render('profile', {user: user})
    }
  })
})

// Register

app.post('/register/success', function(req, res) {
  var userDetails = req.body
  db.addNewUser(userDetails, function(err,user) {
    if(err) {
      res.render('error')
    } else {
      res.render('profile', {user: user})
    }
  })
})


// Lodge a post

app.post('/bizzyprofile/:userName', function(req, res) {
  var postDetails = req.body.post
  var userName = req.params.userName
  db.addPost(userName, postDetails, function (err, user){
    if(err) {
      res.render('error', err)
      return
    } else {
      res.render('profile', {user: user})
    }
  })
})

// Exports app functions
module.exports = app
