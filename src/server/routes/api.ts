/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

// Vendor
import * as Koa from 'koa';
import * as __ from 'koa-route';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';

// Database
import { Database } from '../../backend/data/Database';
import { wrapDatabase } from '../../backend/data/wrapDatabase';

import * as koaConditionalGet from 'koa-conditional-get';
import * as koaEtags from 'koa-etag';

import { Serializer } from '@digihum/falcon-core';

import { itemTypes } from '../../common/itemTypes';

import * as winston from 'winston';

export const api = (db: Database) : Koa => {

    const server = new Koa();

    server.use(koaJSON());
    server.use(koaBodyParser({
        enableTypes: ['json', 'form', 'text']
    }));


    const serverApiContext = wrapDatabase(db, false);

    server.use(async (ctx: Koa.Context, next: any) => {
        if (ctx.req.method === 'GET' || ctx.isAuthenticated()) {
            return await next();
        } else {
            ctx.status = 403;
            ctx.body = 'You must be authorised to modify this resource';
        }
    });

    server.use(async (ctx: Koa.Context, next: any) => {
        try {
            return await next();
        } catch (err) {
            switch (err.constructor.name) {
                case 'KeyNotFoundException':
                    ctx.status = 404;
                    break;
                case 'CollectionNotFoundException':
                    ctx.status = 404;
                    break;
                case 'OperationNotPermittedException':
                    ctx.status = 422;
                    break;
                default:
                    ctx.status = 500;
            }
            ctx.type = 'application/json';
            if ( err.data !== undefined) {
                return await err.data.data.then((data) => {
                    ctx.body = JSON.stringify(Object.assign({}, err.data, { data: data }));
                });
            } else {
                ctx.body = err.message;
            }
        }
    });

    server.use(__.get('/query', async (ctx : Koa.Context) => {
      ctx.body = await serverApiContext.queryEngine.runQuery(ctx.query.query);
    }));

    server.use(__.get('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {

        const data = await serverApiContext
            .getItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids));

        ctx.body = Serializer.toJson(data);
    }));


    server.use(__.get('/:route', async (ctx : Koa.Context, route: string) => {



        const data = await serverApiContext
            .getCollection<any>(itemTypes[route].item, route, ctx.query);

        ctx.body = data.map((datum) => Serializer.toJson(datum));

    }));

    server.use(__.post('/:route', async (ctx : Koa.Context, route: string) => {
      const profileName = `Creating new ${route} at ${Date.now()}`;
      winston.profile(profileName);
      const data = await serverApiContext
          .postItem<any>(itemTypes[route].item, route,
            Serializer.fromJson(itemTypes[route].item, Object.assign(ctx.request.body, {
              creator: ctx.req.user.uid
          })), ctx.query);

      ctx.body = data;
      winston.profile(profileName);
    }));

    server.use(__.put('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
      const profileName = `Replacing new ${route} at ${Date.now()}`;
      winston.profile(profileName);
      const data = await serverApiContext
          .putItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids),
          Serializer.fromJson(itemTypes[route].item, ctx.request.body));

      ctx.body = data;
      winston.profile(profileName);
    }));

    server.use(__.patch('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
      const profileName = `Updating new ${route} at ${Date.now()}`;
      winston.profile(profileName);
      const data = await serverApiContext
          .patchItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids), ctx.request.body);

      ctx.body = data;
      winston.profile(profileName);
    }));

    server.use(__.del('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
      const profileName = `Replacing new ${route} at ${Date.now()}`;
      winston.profile(profileName);
      const data = await serverApiContext
          .delItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids));

      ctx.body = data;
      winston.profile(profileName);
    }));

    return server;
};
