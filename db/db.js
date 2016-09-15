const knex = require('knex')(require('../knexfile').development)
const _ = require('lodash')

module.exports = {

  findUserByResource: function(type, resource, callback) {
    var userFound = []
    knex('users')
    .select()
    .then(function(users) {
      userFound[0] = _.find(users, function(c){
      return c[type] === resource
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
    .select()
    .then(function(){
      newUser[0] = userDetails
      delete newUser[0].commit
      callback(null, newUser)
      return knex('users').insert(newUser)
    })
    .catch(function(err){
      callback(err)
    })
  },

  addPost: function(userName, newPost, callback) {
    var user = []
    knex('users')
    .join('posts', 'id', '=', 'posts.user_id')
    .where({'userName': userName})
    .select()
    .then(function(rows){
      user.push(rows[0])
      return knex.insert({user_id: rows[0].id, post: newPost}).into('posts')
    })
    .then(function(id){
      callback(null, user)
    })
    .catch(function(err){
      callback(err)
    })
  }


}
