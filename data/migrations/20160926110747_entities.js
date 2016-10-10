
exports.up = function(knex, Promise) {
  return knex.schema.createTable('entities', function(table) {
        table.increments('uid').primary();
        table.string('label');
        table.string('type')
            .references('slug')
            .inTable('entity_types');
        table.integer('parent')
            .references('uid')
            .inTable('entities')
            .nullable();
        table.boolean('readonly')
            .defaultTo(false);
    });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('entities');
};
