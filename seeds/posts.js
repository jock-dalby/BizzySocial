var postData = require('../db/posts.js')
var knex = require('knex')


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts')
  .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('posts').insert(postData)
      ]);
    });
};
