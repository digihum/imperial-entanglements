/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import { Database } from '../core/Database';

import { GeneralStatisticsController } from '../stats/GeneralStatisticsController';

export const stats = (db: Database) : Koa => {

    const server = new Koa();
    const router = new KoaRouter();

    router.get('/', async (context) => {
      context.body = await GeneralStatisticsController(db.query());
    });

    server.use(router.middleware());

    return server;
};
