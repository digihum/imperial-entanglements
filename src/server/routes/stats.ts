/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Koa from 'koa';

import { Database } from '../core/Database';

import { GeneralStatisticsController } from '../stats/GeneralStatisticsController';

export const stats = (db: Database) : Koa => {

    const server = new Koa();

    server.use( function* (next : Koa.Context) {
      yield GeneralStatisticsController(db.query())
      .then((result) => {
        this.body = result;
      });
    });

    return server;
};
