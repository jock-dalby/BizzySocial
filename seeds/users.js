var userData = require('../db/users.js')
var knex = require('knex')


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
  .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(userData)
      ]);
    });
};
