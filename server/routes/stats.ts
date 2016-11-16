/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Koa from 'koa';

import * as Knex from 'knex';

export const stats = (config : Knex.Config) : Koa => {

    const server = new Koa();

    server.use( function*(next : Koa.Context) {
        this.body = "STATS!";
    });

    return server;
};