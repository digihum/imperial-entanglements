/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import { Server } from './core/Server';
import { config as loadEnvironmentConfig } from 'dotenv';
import { Config as KnexConfig, ConnectionConfig, Sqlite3ConnectionConfig } from 'knex';

loadEnvironmentConfig();

const databaseConnection : KnexConfig = {
  useNullAsDefault: true,
  connection: {}
};

if (process.env.DB_TYPE === 'sqlite') {
  databaseConnection.client = 'sqlite3';
  if (databaseConnection.connection !== undefined ) {
    (databaseConnection.connection as Sqlite3ConnectionConfig).filename = './data/mydb.sqlite';
  }
  databaseConnection.pool = {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  };
}

if (process.env.DB_TYPE === 'postgres') {
  databaseConnection.client = 'pg';
  (databaseConnection.connection as ConnectionConfig).host = process.env.DB_HOST;
  (databaseConnection.connection as ConnectionConfig).user = process.env.DB_USER;
  (databaseConnection.connection as ConnectionConfig).password = process.env.DB_PASSWORD;
  (databaseConnection.connection as ConnectionConfig).database = process.env.DB_DATABASE;
}

const server = Server(databaseConnection);

server.listen(8080);
