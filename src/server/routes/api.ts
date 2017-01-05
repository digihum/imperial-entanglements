/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as __ from 'koa-route';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';

// Database
import { Database } from '../core/Database';
import { ServerApiService } from '../core/ServerApiService';
import { QueryEngine } from '../core/QueryEngine';

import * as koaConditionalGet from 'koa-conditional-get';
import * as koaEtags from 'koa-etag';

import { Serializer } from 'falcon-core';

import { itemTypes } from '../../common/itemTypes';

// Controllers
import { IController } from '../controllers/IController';

import {
    EntityController,
    EntityTypeController,
    ElementSetController,
    PredicateController,
    SourceController,
    RecordController,
    ElementController,
    SourceElementController
} from '../controllers/controllers';

export const wrapDatabase : (s: Database, fakeCreator: boolean) => ServerApiService =
    (db: Database, fakeCreator: boolean) => {
    const routes = new Map<string, IController>([
        [itemTypes.element_set.machineName, new ElementSetController(db)],
        [itemTypes.record.machineName, new RecordController(db)],
        [itemTypes.entity_type.machineName, new EntityTypeController(db)],
        [itemTypes.entity.machineName, new EntityController(db)],
        [itemTypes.predicate.machineName, new PredicateController(db)],
        [itemTypes.source.machineName, new SourceController(db)],
        [itemTypes.element.machineName, new ElementController(db)],
        [itemTypes.source_element.machineName, new SourceElementController(db)]
    ]);

    return new ServerApiService(db, routes, new QueryEngine(db), fakeCreator);
};

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
        const data = await serverApiContext
            .postItem<any>(itemTypes[route].item, route,
              Serializer.fromJson(itemTypes[route].item, Object.assign(ctx.request.body, {
                creator: ctx.req.user.uid
            })));

        ctx.body = data;
    }));

    server.use(__.put('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
        const data = await serverApiContext
            .putItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids),
            Serializer.fromJson(itemTypes[route].item, ctx.request.body));

        ctx.body = data;
    }));

    server.use(__.patch('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
        const data = await serverApiContext
            .patchItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids), ctx.request.body);

        ctx.body = data;
    }));

    server.use(__.del('/:route/:id+', async (ctx : Koa.Context, route: string, ...ids: string[]) => {
        const data = await serverApiContext
            .delItem<any>(itemTypes[route].item, route, itemTypes[route].buildKey(ids));

        ctx.body = data;
    }));

    return server;
};
