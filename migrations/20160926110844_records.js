
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('records', function(table) {
        table.increments('uid').primary();
        table.integer('source')
            .references('uid')
            .inTable('sources');
        table.integer('predicate')
            .references('uid')
            .inTable('predicates');
        table.integer('entity')
            .references('uid')
            .inTable('entities');
        table.integer('score');
    }),

    knex.schema.createTable('records_ref', function(table) {
        table.increments('uid')
            .primary()
            .references('uid')
            .inTable('records');
        table.string('reference')
            .references('uid')
            .inTable('entities');   
    }),

    knex.schema.createTable('records_val', function(table) {
        table.increments('uid')
            .primary()
            .references('uid')
            .inTable('records');
        table.json('value');  
    })
    
    
    ]);
};


exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('records'),
      knex.schema.dropTable('records_ref'),
      knex.schema.dropTable('records_val')
  ]);
};
