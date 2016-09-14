
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id').primary
    table.string('name')
    table.string('image')
    table.string('password')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
