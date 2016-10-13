
function createRecordSubtable(knex, name, callback) {
    return knex.schema.createTable(name, function(table) {
        table.increments('uid')
            .primary()
            .references('uid')
            .inTable('records');
        callback(table);
    });
}


exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('records', function(table) {
        table.increments('uid').primary();

        table.integer('source')
            .references('uid')
            .inTable('sources');            

        table.integer('predicate')
            .notNullable()
            .references('uid')
            .inTable('predicates');

        table.integer('entity')
            .notNullable()
            .references('uid')
            .inTable('entities');   

        table.integer('score')
            .nullable()
            .defaultTo(0);            

        table.integer('period')
            .nullable()
            .references('uid')
            .inTable('entities');
            
    }),

    createRecordSubtable(knex, 'records_entity', function(table) {
        table.integer('reference')
            .references('uid')
            .inTable('entities');   
    }),

    createRecordSubtable(knex, 'records_string', function(table) {
        table.text('value');
    }),

    createRecordSubtable(knex, 'records_date', function(table) {
        table.text('value');
    }),

    createRecordSubtable(knex, 'records_integer', function(table) {
        table.integer('value');
    }),

    createRecordSubtable(knex, 'records_spatial_point', function(table) {
        table.string('value');
    }),

    createRecordSubtable(knex, 'records_spatial_region', function(table) {
        table.binary('value');
    })

    ]);
};


exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('records'),
      knex.schema.dropTable('records_entity'),
      knex.schema.dropTable('records_string'),
      knex.schema.dropTable('records_date'),
      knex.schema.dropTable('records_integer'),
      knex.schema.dropTable('records_spatial_point'),
      knex.schema.dropTable('records_spatial_region')
  ]);
};
