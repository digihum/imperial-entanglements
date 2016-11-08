/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Server } from './core/Server';
import { config as loadEnvironmentConfig } from 'dotenv';

loadEnvironmentConfig();

const server = new Server();

const databaseConnection = {
  useNullAsDefault: true,
  connection: {}
};

if (process.env.DB_TYPE === 'sqlite') {
  databaseConnection.client = 'sqlite3';
  databaseConnection.connection.filename = './mydb.sqlite';
  databaseConnection.pool = {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    }
  };
}

if (process.env.DB_TYPE === 'postgres') {
  databaseConnection.client = 'pg';
  databaseConnection.connection.host = process.env.DB_HOST;
  databaseConnection.connection.user = process.env.DB_USER;
  databaseConnection.connection.password = process.env.DB_PASSWORD;
  databaseConnection.connection.database = process.env.DB_DATABASE;
}

server.init(databaseConnection);

server.listen();