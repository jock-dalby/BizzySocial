
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('posts', function (table) {
    table.integer('user_id').primary
    table.string('post')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts')
};
