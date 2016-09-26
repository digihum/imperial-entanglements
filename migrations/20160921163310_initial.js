
exports.up = function(knex, Promise) {
   return Promise.all([
       
      knex.schema.createTable('sources', function(table) {
        table.increments('uid').primary();
        table.string('name');
        table.boolean('readonly')
            .defaultTo(false);
      }),

      knex.schema.createTable('element_sets', function(table) {
        table.increments('uid').primary();
        table.string('uri');
        table.string('name');
        table.string('description');
      }),

      knex.schema.createTable('elements', function(table) {
        table.increments('uid').primary();
        table.string('uri');
        table.integer('element_set')
            .index()
            .references('uid')
            .inTable('element_sets');
        table.string('name');
        table.string('description');
        table.string('comment');
      }),

      knex.schema.createTable('source_elements', function(table) {
        table.increments('uid').primary();
        table.integer('source')
            .index()
            .references('uid')
            .inTable('sources');
        table.integer('element')
            .index()
            .references('uid')
            .inTable('elements');
        table.string('value');
      }),

    ]);
};

exports.down = function(knex, Promise) {
   return Promise.all([
       knex.schema.dropTable('sources'),
       knex.schema.dropTable('element_sets'),
       knex.schema.dropTable('elements'),
       knex.schema.dropTable('source_elements')
    ]);
};
