
var fs = require('fs');
var _ = require('lodash');
require('dotenv').config();

exports.up = function(knex, Promise) {

  let autoIncrementCommand = 'INTEGER PRIMARY KEY AUTOINCREMENT';
  if (process.env.DB_TYPE === 'postgres') {
      autoIncrementCommand = 'SERIAL PRIMARY KEY'
  }

  var files = [
    'sources.sql',
    'predicates.sql',
    'entity_types.sql',
    'entities.sql',
    'records.sql',
    'view_predicate_usage.sql'
  ];

  var creationScript = files
    .map((filename) => fs.readFileSync('data/migrations/' + filename, 'utf8'))
    .map((fileContents) => _.template(fileContents))
    .map((template) => template({ auto_increment: 'INTEGER PRIMARY KEY AUTOINCREMENT'}))
    .join(' ');

//   var creationScript =
//       fs.readFileSync('data/migrations/', 'utf8') +
//       fs.readFileSync('data/migrations/predicates.sql', 'utf8') +
//       fs.readFileSync('data/migrations/entity_types.sql', 'utf8') +
//       fs.readFileSync('data/migrations/entities.sql', 'utf8') +
//       fs.readFileSync('data/migrations/records.sql', 'utf8') +
//       fs.readFileSync('data/migrations/view_predicate_usage.sql', 'utf8');

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
