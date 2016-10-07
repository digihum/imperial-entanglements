
exports.up = function(knex, Promise) {

    return Promise.all([

        knex.schema.createTable('predicates', function(table) {
            table.increments('uid').primary();
            table.string('name');
            table.string('description');
            table.string('same_as');
            table.string('domain')
                .references('slug')
                .inTable('entity_types');
            table.boolean('readonly')
                .defaultTo(false);
        }),

        knex.schema.createTable('predicates_ref', function(table) {
            table.integer('uid')
                .primary()
                .references('uid')
                .inTable('predicates');
            table.string('range')
                .references('slug')
                .inTable('entity_types');   
        }),

        knex.schema.createTable('predicates_val', function(table) {
            table.integer('uid')
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
