/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';

// Database
import { Database } from '../core/Database';
import { ServerApiService, AppUrls } from '../core/ServerApiService';
import { QueryEngine } from '../core/QueryEngine';

import * as koaConditionalGet from 'koa-conditional-get';
import * as koaEtags from 'koa-etag';

import { Serializer, TrackedFalconItem } from 'falcon-core';

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

import {
  Entity, EntityType, ElementSet, Predicate, Source, Record, Element, SourceElement
} from 'falcon-core';

export const wrapDatabase : (s: Database, fakeCreator: boolean) => ServerApiService =
    (db: Database, fakeCreator: boolean) => {
    const routes = new Map<string, IController>([
        [AppUrls.element_set, new ElementSetController(db)],
        [AppUrls.record, new RecordController(db)],
        [AppUrls.entity_type, new EntityTypeController(db)],
        [AppUrls.entity, new EntityController(db)],
        [AppUrls.predicate, new PredicateController(db)],
        [AppUrls.source, new SourceController(db)],
        [AppUrls.element, new ElementController(db)],
        [AppUrls.source_element, new SourceElementController(db)]
    ]);

    return new ServerApiService(db, routes, new QueryEngine(db), fakeCreator);
};

const sourceElementSpecial = (router: any, serverApiContext: ServerApiService, typeMap: any) => {

  router.use(koaConditionalGet());
  router.use(koaEtags());

    router.get(`/${AppUrls.source_element}/:source/:element`, function* (ctx : Koa.Context) {
        yield serverApiContext
            .getItem<TrackedFalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: ctx.params.source,
                    element: ctx.params.element
                }
            })
            .then((data) => ctx.body = Serializer.toJson(data));
    });

    router.put(`/${AppUrls.source_element}/:source/:element`, function* (ctx : Koa.Context) {
        yield serverApiContext
            .putItem<TrackedFalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: ctx.params.source,
                    element: ctx.params.element
                }
            }, ctx.request.body)
            .then((data) => ctx.body = data);
    });

    router.patch(`/${AppUrls.source_element}/:source/:element`, function* (ctx : Koa.Context) {
        yield serverApiContext
            .patchItem<TrackedFalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: ctx.params.source,
                    element: ctx.params.element
                }
            }, ctx.request.body)
            .then((data) => ctx.body = data);
    });

    router.del(`/${AppUrls.source_element}/:source/:element`, function* (ctx : Koa.Context) {
        yield serverApiContext
            .delItem<TrackedFalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: ctx.params.source,
                    element: ctx.params.element
                }
            })
            .then((data) => ctx.body = data);
    });
};

// would be cleaner if it allowed 2nd level REST urls
//  /entity/{entity_id}/predicate/{predicate_id}
// /source/{source_id}/element/{element_id}

const typeMap = {
    [AppUrls.element_set]: ElementSet,
    [AppUrls.record]: Record,
    [AppUrls.entity_type]: EntityType,
    [AppUrls.entity]: Entity,
    [AppUrls.predicate] : Predicate,
    [AppUrls.source] : Source,
    [AppUrls.element] : Element,
    [AppUrls.source_element]: SourceElement
};

export const api = (db: Database) : Koa => {

    const server = new Koa();
    const router = new KoaRouter();

    // router.use(koaJSON());
    // router.use(koaBodyParser({
    //     enableTypes: ['json', 'form', 'text']
    // }));

    const serverApiContext = wrapDatabase(db, false);

    router.use(async (ctx: Koa.Context, next: any) => {
        if (ctx.req.method === 'GET' || ctx.isAuthenticated()) {
            return await next();
        } else {
            ctx.status = 403;
            ctx.body = 'You must be authorised to modify this resource';
        }
    });

    router.use(async (ctx: Koa.Context, next: any) => {
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

    router.get('/query', async (ctx : Koa.Context) => {
      ctx.body = await serverApiContext.queryEngine.runQuery(ctx.query.query);
    });

    sourceElementSpecial(router, serverApiContext, typeMap);

    router.get('/:route/:id', async (ctx : Koa.Context) => {

        const data = await serverApiContext
            .getItem<any>(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id));

        ctx.body = Serializer.toJson(data);
    });


    router.get('/:route', async (ctx : Koa.Context) => {
        const data = await serverApiContext
            .getCollection<any>(typeMap[ctx.params.route], ctx.params.route, ctx.query);

        ctx.body = data.map((datum) => Serializer.toJson(datum));
    });

    router.post('/:route', async (ctx : Koa.Context) => {
        const data = await serverApiContext
            .postItem<any>(typeMap[ctx.params.route], ctx.params.route,
              Serializer.fromJson(typeMap[ctx.params.route], Object.assign(ctx.request.body, {
                creator: ctx.req.user.uid
            })));

        ctx.body = data;
    });

    router.put('/:route/:id', async (ctx : Koa.Context) => {
        const data = await serverApiContext
            .putItem<any>(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id),
            Serializer.fromJson(typeMap[ctx.params.route],ctx.request.body));

        ctx.body = data;
    });

    router.patch('/:route/:id', async (ctx : Koa.Context) => {
        const data = await serverApiContext
            .patchItem<any>(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id), ctx.request.body);

        ctx.body = data;
    });

    router.del('/:route/:id', async (ctx : Koa.Context) => {
        const data = await serverApiContext
            .delItem<any>(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id));

        ctx.body = data;
    });

    server.use(router.routes());
    server.use(router.allowedMethods());

    return server;
};
