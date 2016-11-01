// Update with your config settings.

require('dotenv').config();

const databaseConnection = {
  useNullAsDefault: true,
  connection: {},
  migrations: {
    directory: './data/migrations'
  },
  seeds: {
    directory: './data/seeds'
  }
};

if (process.env.DB_TYPE === 'sqlite') {
  databaseConnection.client = 'sqlite3';
  databaseConnection.connection.filename = './mydb.sqlite';
}

if (process.env.DB_TYPE === 'postgres') {
  databaseConnection.client = 'pg';
  databaseConnection.connection.host = process.env.DB_HOST;
  databaseConnection.connection.user = process.env.DB_USER;
  databaseConnection.connection.password = process.env.DB_PASSWORD;
  databaseConnection.connection.database = process.env.DB_DATABASE;
}


module.exports = {
  development: databaseConnection
};
