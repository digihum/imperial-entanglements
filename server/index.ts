/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Server } from './core/Server';

const server = new Server();

server.init({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

server.listen();