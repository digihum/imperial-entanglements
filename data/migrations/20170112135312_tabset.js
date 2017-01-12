
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tabset', function (table) {
    table.increments('uid').primary();
    table.integer('owner').unsigned().index().references('uid').inTable('users');
    table.string('name');
    table.text('tabs');
 });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tabset');
};
