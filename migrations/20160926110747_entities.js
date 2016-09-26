
exports.up = function(knex, Promise) {
  return knex.schema.createTable('entities', function(table) {
        table.increments('uid').primary();
        table.string('type')
            .references('slug')
            .inTable('entity_types');
    });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('entities');
};
