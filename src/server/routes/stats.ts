/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as Koa from 'koa';
import * as __ from 'koa-route';

import { Database } from '../../backend/data/Database';

import { GeneralStatisticsController } from '../../backend/stats/GeneralStatisticsController';

export const stats = (db: Database) : Koa => {

    const server = new Koa();

    server.use(__.get('/', async (ctx: Koa.Context) => {
      ctx.body = await GeneralStatisticsController(db.query());
    }));

    return server;
};
