const knex = require('knex')(require('../knexfile').development)
const _ = require('lodash')



module.exports = {

  findUserByName: function(userName, callback) {
    var userFound = []
    knex('users')
    .select('userName', 'id', 'logo')
    .then(function(users) {
      userFound[0] = _.find(users, function(c){
      return c.userName === userName
    })
    callback(null, userFound)
    })
    .catch(function(err){
      callback(err)
    })
  },

  addNewUser: function(userDetails, callback) {
    var newUser = []
    knex('users')
    .then(function(){
      newUser[0] = userDetails
      delete newUser[0].commit
      knex('users').insert(newUser)
    .then(function(){
        return callback(null, newUser)
      })
    })
    .catch(function(err){
      callback(err)
    })
  },

  addPost: function(userId, newPost, callback) {
    var user = []
    knex('users')
    // .join('posts', 'users.id', '=', 'posts.user_id')
    .where({'id': userId})
    .select('userName', 'logo')
    .then(function(rows){
      user.push(rows[0])
      callback(null, user)
      return knex.insert({user_id: userId, post: JSON.stringify(newPost)}).into('posts')
    })
    .catch(function(err){
      callback(err)
    })
  },

  // findFollowers: function(userId, callback) {
  //   knex('users as users1')
  //   .join('follow', 'users1.id', '=', 'follow.user_id')
  //   .join('users as users2', 'follow.follower', '=', 'users2.id')
  //   .select()
  //   .then(function(rows){
  //     _.each(rows, function(row){
  //       console.log(row)
  //     })
  //   })
  // }

}
