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

// app.get('/bizzyprofile/:id/following', function(req, res) {
//   var userId = Number(req.params.id)
//   db.findFollowers(userId, function(err, user, followers){
//     if(err) {
//       res.render('error')
//     } else {
//       res.render('RESULTS!!!!!!!')
//     }
//   })
// })


// Log-In Page Submission

app.post('/bizzyprofile', function(req, res) {
  var userName = req.body.userName
  var temp= []
  var followers = []
  var others = []
  var postItems = []
  db.findUserByName(userName, function(err, user) {
    if (err) {
      res.render('error')
    } else {
      knex('follow').where({'user_id': user[0].id})
      .select('follower')
      .then(function(rows){
        temp = JSON.parse(rows[0].follower)
        return
      })
      // find business following an dnot following
      knex('users')
      .select()
      .then(function(rows){
        _.forEach(rows, function(row){
            if(row.id !== user[0].id) {
            var count = 0
            _.forEach(temp, function(n){
              if(row.id === n) {
                followers.push(row)
              } else {
                count ++
              }
            })
            if(count === temp.length) {
              others.push(row)
            }
          }
        })
        return
      })
      knex('users')
      .join('posts', 'id', '=', 'posts.user_id')
      .select('id', 'userName', 'post')
      .then(function(rows){
        _.forEach(rows, function(row){
            _.forEach(temp, function(n){
              if(row.id === n) {
                postItems.push(row)
              }
            })
          })
        })
      .then(function(){
        postItems.reverse()
        return res.render('profile', {user:user, followers:followers, others:others, postItems: postItems})
      })
    }
  })
})


// Registration Page Submission

app.post('/register/success', function(req, res) {
  var userDetails = req.body
  db.addNewUser(userDetails, function(err, msg) {
    if(err) {
      res.render('error')
    } else {
      var user = []
      knex('users')
      .select('userName', 'id', 'logo')
      .then(function(users) {
        user[0] = _.find(users, function(c){
          return c.userName === userDetails.userName
          })
        res.render('profile', {user:user})
        })
      .catch(function(err){
        render('error')
      })
    }
  })
})


// Lodge a post

app.post('/bizzyprofile/:id', function(req, res) {
  var userId = req.params.id
  var postDetails = req.body.post
  var temp= []
  var followers = []
  var others = []
  var postItems = []
  db.addPost(userId, postDetails, function (err, user){
    if (err) {
      res.render('error')
    } else {
      knex('follow').where({'user_id': user[0].id})
      .select('follower')
      .then(function(rows){
        temp = JSON.parse(rows[0].follower)
        return
      })
      // find business following an dnot following
      knex('users')
      .select()
      .then(function(rows){
        _.forEach(rows, function(row){
            if(row.id !== user[0].id) {
            var count = 0
            _.forEach(temp, function(n){
              if(row.id === n) {
                followers.push(row)
              } else {
                count ++
              }
            })
            if(count === temp.length) {
              others.push(row)
            }
          }
        })
        return
      })
      knex('users')
      .join('posts', 'id', '=', 'posts.user_id')
      .select('id', 'userName', 'post')
      .then(function(rows){
        _.forEach(rows, function(row){
            _.forEach(temp, function(n){
              if(row.id === n) {
                postItems.push(row)
              }
            })
          })
        })
      .then(function(){
        postItems.reverse()
        return res.render('profile', {user:user, followers:followers, others:others, postItems: postItems})
      })
    }
  })
})


// Exports app functions
module.exports = app
