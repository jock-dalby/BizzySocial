exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('follow', function (table) {
    table.integer('user_id').primary
    table.string('follower')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('follow')
};
