/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Server } from './core/server';

import * as knex from 'knex';

const server = new Server();

server.init();
server.listen();
