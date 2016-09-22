/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { Server } from './core/server';

const server = new Server();

server.init();
server.listen();

import { ElementSet } from './datamodel/AbstractSource';

const a = new ElementSet();