
var fs = require('fs');

exports.up = function(knex, Promise) {

  var creationScript =
      fs.readFileSync('data/migrations/sources.sql', 'utf8') +
      fs.readFileSync('data/migrations/predicates.sql', 'utf8') +
      fs.readFileSync('data/migrations/entity_types.sql', 'utf8') +
      fs.readFileSync('data/migrations/entities.sql', 'utf8') +
      fs.readFileSync('data/migrations/records.sql', 'utf8') +
      fs.readFileSync('data/migrations/view_predicate_usage.sql', 'utf8');

  var statements = creationScript.split(';').filter((statement) => statement.length > 0);

  var prom = statements.reduce((prev, cur, index) => prev.then(() => knex.schema.raw(cur + ';')), Promise.resolve());

  return prom;  
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.schema.dropTable('entities'),
        knex.schema.dropTable('entity_types'),
        knex.schema.dropTable('sources'),
        knex.schema.dropTable('predicates'),
        knex.schema.dropTable('records'),
        knex.schema.dropTable('element_sets'),
        knex.schema.dropTable('elements'),
        knex.schema.dropTable('source_elements')
    ]);
};
