
exports.up = function(knex, Promise) {
  return knex.schema.createTable('entity_types', function(table) {
        table.string('slug').primary();
        table.string('name');
        table.string('description');
        table.string('parent')
            .references('slug')
            .inTable('entity_types');
        table.string('same_as');
        table.string('colour');
        table.string('icon');   
        table.boolean('readonly')
            .defaultTo(false);
    });
};


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('entity_types');
};