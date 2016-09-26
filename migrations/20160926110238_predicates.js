
exports.up = function(knex, Promise) {

    return Promise.all([

        knex.schema.createTable('predicates', function(table) {
            table.increments('uid').primary();
            table.string('name');
            table.string('description');
            table.string('domain')
                .references('slug')
                .inTable('entity_types');
        }),

        knex.schema.createTable('predicates_ref', function(table) {
            table.increments('uid')
                .primary()
                .references('uid')
                .inTable('predicates');
            table.string('range')
                .references('slug')
                .inTable('entity_types');   
        }),

        knex.schema.createTable('predicates_val', function(table) {
            table.increments('uid')
                .primary()
                .references('uid')
                .inTable('predicates');
            table.string('range');  
        })

    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('predicates'),
        knex.schema.dropTable('predicates_ref'),
        knex.schema.dropTable('predicates_val')
    ]);
};
