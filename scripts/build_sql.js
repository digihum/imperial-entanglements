
var fs = require('fs');

var creationScript =
    fs.readFileSync('data/migrations/sources.sql', 'utf8') + "\n\n" +
    fs.readFileSync('data/migrations/predicates.sql', 'utf8') + "\n\n" +
    fs.readFileSync('data/migrations/entity_types.sql', 'utf8') + "\n\n" +
    fs.readFileSync('data/migrations/entities.sql', 'utf8') + "\n\n" +
    fs.readFileSync('data/migrations/records.sql', 'utf8');

fs.writeFile('build/all.sql', creationScript, function(err) {
  if (err) throw err;
});