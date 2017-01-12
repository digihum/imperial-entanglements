const sqlite = require('sqlite3');
const fs = require('fs');
const _ = require('lodash');

const db = new sqlite.Database('data/app.sqlite');

db.on("open", () => {

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

//  console.log(statements);

  fs.writeFile('test.json', JSON.stringify(statements), function (err) {
    if (err) return console.log(err);
    });

statements.forEach((statement) => db.run(statement, (err) => err === null ? null :  console.log(err, statement) ));

  db.close();
    
});
