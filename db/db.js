const knex = require('knex')(require('../knexfile').development)
const _ = require('lodash')

module.exports = {

  findUserByName: function(userName) {
    return knex('users').where({'userName':userName}).select('userName', 'id', 'logo')
  },

  addNewUser: function(userDetails) {
    var newUser = []
    newUser[0] = userDetails
    delete newUser[0].commit
    return knex('users').insert(newUser)
  },

  addPost: function(userId, newPost) {
    return knex.insert({user_id: userId, post: newPost}).into('posts')
  }

}
