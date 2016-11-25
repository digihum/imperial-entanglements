
const Knex = require('knex');

const db = Knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: 'mydb.sqlite'
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
    //debug: true
});


module.exports = function () {

  this.Then(/^there is an entity with label "([^"]*)" in the database$/, function (browser, label) {
    return db('entities').select().where({ label }).count()
    .then(([result]) => {
        browser.assert.equal(result['count(*)'], 1, "expected an enitity to exist with label " + label)
    })
  });
}
