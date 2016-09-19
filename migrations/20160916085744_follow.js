exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('follow', function (table) {
    table.integer('user_id').primary
    table.integer('follow_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('follow')
};
