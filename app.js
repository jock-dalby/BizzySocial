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
  var userProfile = []
  var followingList = []
  var followArr = []
  var othersList = []
  var postsArr = []
  return db.findUserByName(userName)
  .then(function(user){
    userProfile = user
    return knex('users')
    .join('follow', 'id', '=', 'follow.user_id')
    .where({'id': Number(user[0].id)})
    .select('follow_id')
  })
  .then(function(following){
    _.map(following, function(f){
        followArr.push(f.follow_id)
    })
    return knex('users').whereIn('id', followArr).select('userName', 'logo')
  })
  .then(function(followList){
    followingList = followList
    return knex('users').whereNotIn('id', followArr).select('userName', 'logo')
  })
  .then(function(others){
    othersList = others
    return knex('users').join('posts', 'id', '=', 'posts.user_id').whereIn('user_id', followArr).select('userName', 'post')
  })
  .then(function(postInfo){
    postsArr = postInfo
  })
  .then(function(){
    return res.render('profile', {user:userProfile, following:followingList, others:othersList, postItems: postsArr})
  })
  .catch(function(err){
    render('error') // UPDATE ERROR RENDER PAGE STUFF!!!
  })
})


// Registration Page Submission

app.post('/register/success', function(req, res) {
  var userDetails = req.body
  return db.addNewUser(userDetails)
  .then(function(){
    return knex('users').where({'userName':userDetails.userName}).select('userName', 'id', 'logo')
  })
  .then(function(user){
    console.log(user)
    res.render('profile', {user:user})
  })
  .catch(function(err){
    res.render('error')
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
