// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './mydb.sqlite'
    },

    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },

    // client: 'pg',
    // connection: {
    //   host : '127.0.0.1',
    //   user : 'postgres',
    //   password : 'password',
    //   database : 'falcon'
    // }
  }

};
