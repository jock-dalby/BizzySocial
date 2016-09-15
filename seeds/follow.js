var followData = require('../db/follow.js')
var knex = require('knex')


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('follow')
  .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('follow').insert(followData)
      ]);
    });
};
