
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('uid').primary();
    table.string('name');
    table.string('username');
    table.string('email');
    table.string('password', 128);
 });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
