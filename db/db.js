const knex = require('knex')(require('../knexfile').development)
const _ = require('lodash')

module.exports = {

  findUserByName: function(database, userName, callback) {
    knex(database)
    .select()
    .then(function(users) {
      var userMatch = []
      userMatch[0] = _.find(users, function(c){
      return c.name === userName
    })
    callback(null, userMatch)
    })
    .catch(function(err){
      callback(err)
    })
  },

  addNewUser: function(database, userDetails, callback) {
    var newUser = []
    knex(database)
    .select()
    .then(function(){
      newUser[0] = userDetails
      delete newUser[0].commit
      callback(null, newUser)
      return knex(database).insert(newUser)
    })
    .catch(function(err){
      callback(err)
    })
  }


}
