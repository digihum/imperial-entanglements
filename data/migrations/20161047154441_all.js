
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
    'entity_types.sql',
    'predicates.sql',
   'entities.sql',
   'records.sql',
   'view_predicate_usage.sql'
  ];

  var creationScript = files
    .map((filename) => fs.readFileSync('data/migrations/' + filename, 'utf8'))
    .map((fileContents) => _.template(fileContents))
    .map((template) => template({ auto_increment: autoIncrementCommand}))
    .join(' ');

  var statements = creationScript.split(';').map((statement) => statement.trim()).filter((statement) => statement.length > 0);

  if (process.env.DB_TYPE === 'sqlite') {
      statements.unshift('PRAGMA foreign_keys = TRUE;');
  }

  var prom = statements.reduce((prev, cur, index) => prev.then(() => knex.schema.raw(cur + ';')), Promise.resolve());

  return prom;  
};

exports.down = function(knex, Promise) {
  return Promise.all([
        // knex.schema.raw('DROP VIEW predicate_usage'),
        // knex.schema.dropTable('records'),
        // knex.schema.dropTable('entities'),
        // knex.schema.dropTable('predicates'),        
        // knex.schema.dropTable('source_elements'),
        // knex.schema.dropTable('elements'),
        // knex.schema.dropTable('element_sets'),
        // knex.schema.dropTable('entity_types'),
        knex.schema.dropTable('sources'),
    ]);
};
