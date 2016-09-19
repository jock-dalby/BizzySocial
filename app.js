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


// Log-In Page Submission

app.post('/bizzyprofile', function(req, res) {
  var userName = req.body.userName
  var userProfile = []
  var followingArr = []
  var followingList = []
  var othersArr = []
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
      if(f.follow_id !== userProfile[0].id) {
        followingList.push(f.follow_id)
      }
    })
    return knex('users').whereIn('id', followingList).select('userName', 'logo')
  })
  .then(function(followList){
    followingArr = followList
    return knex('users').whereNotIn('id', followingList).select('userName', 'logo')
  })
  .then(function(others){
    console.log('others ', others)
    othersArr = _.remove(others, function(x){ return x.userName !== userProfile[0].userName})
    followingList.push(userProfile[0].id)
    return knex('users').join('posts', 'id', '=', 'posts.user_id').orderBy('created_at', 'desc').whereIn('user_id', followingList).select('userName', 'post')
  })
  .then(function(postInfo){
    postsArr = postInfo
  })
  .then(function(){
    return res.render('profile', {user:userProfile, following:followingArr, others:othersArr, postItems: postsArr})
  })
  .catch(function(err){
    res.render('error') // UPDATE ERROR RENDER PAGE STUFF!!!
    console.log("Log in error", err)
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
  var userProfile = []
  var followingArr = []
  var followingList = []
  var othersArr = []
  var postsArr = []
  return db.addPost(userId, postDetails)
  .then(function(){
    return knex('users').where({'id':userId}).select('userName', 'id', 'logo')
  })
  .then(function(user){
    userProfile = user
    return knex('users')
    .join('follow', 'id', '=', 'follow.user_id')
    .where({'id': Number(user[0].id)})
    .select('follow_id')
  })
  .then(function(following){
    _.map(following, function(f){
      followingList.push(f.follow_id)
    })
    return knex('users').whereIn('id', followingList).select('userName', 'logo')
  })
  .then(function(followList){
    followingArr = followList
    return knex('users').whereNotIn('id', followingList).select('userName', 'logo')
  })
  .then(function(others){
    othersArr = _.remove(others, function(x){ return x.userName !== userProfile[0].userName})
    return knex('users').join('posts', 'id', '=', 'posts.user_id').orderBy('created_at', 'desc').whereIn('user_id', followingList).select('userName', 'post')
  })
  .then(function(postInfo){
    postsArr = postInfo
  })
  .then(function(){
    return res.render('profile', {user:userProfile, following:followingArr, others:othersArr, postItems: postsArr})
  })
  .catch(function(err){
    res.render('error') // UPDATE ERROR RENDER PAGE STUFF!!!
  })
})


// Exports app functions
module.exports = app
