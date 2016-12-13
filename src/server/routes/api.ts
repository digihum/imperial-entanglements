/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

// Database
import { Database } from '../core/Database';
import { ServerApiService, AppUrls } from '../core/ServerApiService';
import { QueryEngine } from '../core/QueryEngine';

import * as koaConditionalGet from 'koa-conditional-get';
import * as koaEtags from 'koa-etag';

import { Serializer, FalconItem } from 'falcon-core';

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

    router.get(`/api/v1/${AppUrls.source_element}/:source/:element`, function* (next : Koa.Context) {
        yield serverApiContext
            .getItem<FalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: this.params.source,
                    element: this.params.element
                }
            })
            .then((data) => this.body = Serializer.toJson(data));
    });

    router.put(`/api/v1/${AppUrls.source_element}/:source/:element`, function* (next : Koa.Context) {
        yield serverApiContext
            .putItem<FalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: this.params.source,
                    element: this.params.element
                }
            }, this.request.body)
            .then((data) => this.body = data);
    });

    router.patch(`/api/v1/${AppUrls.source_element}/:source/:element`, function* (next : Koa.Context) {
        yield serverApiContext
            .patchItem<FalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: this.params.source,
                    element: this.params.element
                }
            }, this.request.body)
            .then((data) => this.body = data);
    });

    router.del(`/api/v1/${AppUrls.source_element}/:source/:element`, function* (next : Koa.Context) {
        yield serverApiContext
            .delItem<FalconItem>(typeMap[AppUrls.source_element], AppUrls.source_element, {
                order: ['source', 'element'],
                values: {
                    source: this.params.source,
                    element: this.params.element
                }
            })
            .then((data) => this.body = data);
    });
};

// would be cleaner if it allowed 2nd level REST urls
//  /entity/{entity_id}/predicate/{predicate_id}
// /source/{source_id}/element/{element_id}

export const api : (router: KoaRouter, s: ServerApiService) => KoaRouter
    = (router: KoaRouter, serverApiContext: ServerApiService) => {

    router.use()

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

    router.use(function* (next: Koa.Context) {
        if (this.req.method === 'GET' || this.isAuthenticated()) {
            yield next;
        } else {
            this.status = 403;
            this.body = 'You must be authorised to modify this resource';
        }
    });

    router.use(function* (next: Koa.Context){
        try {
            yield next;
        } catch (err) {
            switch (err.constructor.name) {
                case 'KeyNotFoundException':
                    this.status = 404;
                    break;
                case 'CollectionNotFoundException':
                    this.status = 404;
                    break;
                case 'OperationNotPermittedException':
                    this.status = 422;
                    break;
                default:
                    this.status = 500;
            }
            this.type = 'application/json';
            if ( err.data !== undefined) {
                yield err.data.data.then((data) => {
                    this.body = JSON.stringify(Object.assign({}, err.data, { data: data }));
                });
            } else {
                this.body = err.message;
            }
        }
    });

    router.get('/api/v1/query', function* (next : Koa.Context) {
        yield serverApiContext.queryEngine.runQuery(this.query.query)
            .then((result) => this.body = result);
    });

    sourceElementSpecial(router, serverApiContext, typeMap);

    router.get('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .getItem<any>(typeMap[this.params.route], this.params.route, parseInt(this.params.id))
            .then((data) => this.body = Serializer.toJson(data));
    });


    router.get('/api/v1/:route', function* (next : Koa.Context) {
        yield serverApiContext
            .getCollection<any>(typeMap[this.params.route], this.params.route, this.query)
            .then((data) => this.body = data.map((datum) => Serializer.toJson(datum)));
    });

    router.post('/api/v1/:route', function* (next : Koa.Context) {
        yield serverApiContext
            .postItem<any>(typeMap[this.params.route],this.params.route,
              Serializer.fromJson(typeMap[this.params.route], Object.assign(this.request.body, {
                creator: this.req.user.uid
            })))
            .then((data) => this.body = data);
    });

    router.put('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .putItem<any>(typeMap[this.params.route], this.params.route, parseInt(this.params.id),
            Serializer.fromJson(typeMap[this.params.route],this.request.body))
            .then((data) => this.body = data);
    });

    router.patch('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .patchItem<any>(typeMap[this.params.route], this.params.route, parseInt(this.params.id), this.request.body)
            .then((data) => this.body = data);
    });

    router.del('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .delItem<any>(typeMap[this.params.route], this.params.route, parseInt(this.params.id))
            .then((data) => this.body = data);
    });

    return router;
};

