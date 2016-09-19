const knex = require('knex')(require('../knexfile').development)
const _ = require('lodash')

module.exports = {

  findUserByName: function(userName) {
    return knex('users').where({'userName':userName}).select('userName', 'id', 'logo')
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
    .where({'id': userId})
    .select('userName', 'id', 'logo')
    .then(function(rows){
      user.push(rows[0])
      callback(null, user)
      return knex.insert({user_id: userId, post: newPost}).into('posts')
    })
    .catch(function(err){
      callback(err)
    })
  }

}
