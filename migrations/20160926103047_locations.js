
exports.up = function(knex, Promise) {

    return Promise.all([

        knex.schema.createTable('location_types', function(table) {
            table.string('type').primary();
        }),

        knex.schema.createTable('locations', function(table) {
            table.increments('uid').primary();
            table.string('name');
            table.string('description');
            table.string('type')
                .references('type')
                .inTable('location_types');
            table.integer('parent')
                .references('uid')
                .inTable('locations');
            table.string('latlng');
            table.jsonb('area');        
        }),

        knex.schema.createTable('virtual_location', function(table) {
            table.increments('uid').primary();
            table.string('name');
            table.string('description');
            table.string('url');
            table.timestamp('accessed');
            table.binary('snapshot');      
        })

    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('location_types'),
        knex.schema.dropTable('locations'),
        knex.schema.dropTable('virtual_location')
    ]);
};
