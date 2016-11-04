/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';

import * as moment from 'moment';

// Database
import { Database } from '../core/Database';
import { ServerApiService, AppUrls } from '../core/ServerApiService';
import { Persistable } from '../core/Persistable';
import { QueryEngine } from '../core/QueryEngine';

// Controllers
import { IController } from '../controllers/IController';

import {
    EntityController, EntityPersistable,
    EntityTypeController, EntityTypePersistable,
    ElementSetController, ElementSetPersistable,
    PredicateController, PredicatePersistable,
    SourceController, SourcePersistable,
    RecordController, RecordPersistable,
    ElementController, ElementPersistable,
    SourceElementController, SourceElementPersistable
} from '../controllers/controllers';

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

    return new ServerApiService(routes, new QueryEngine(db), fakeCreator);
};

// would be cleaner if it allowed 2nd level REST urls
//  /entity/{entity_id}/predicate/{predicate_id}
// /source/{source_id}/element/{element_id}

export const api : (router: KoaRouter, s: ServerApiService) => KoaRouter
    = (router: KoaRouter, serverApiContext: ServerApiService) => {

    const typeMap = {
        [AppUrls.element_set]: ElementSetPersistable,
        [AppUrls.record]: RecordPersistable,
        [AppUrls.entity_type]: EntityTypePersistable,
        [AppUrls.entity]: EntityPersistable,
        [AppUrls.predicate] : PredicatePersistable,
        [AppUrls.source] : SourcePersistable,
        [AppUrls.element] : ElementPersistable,
        [AppUrls.source_element]: SourceElementPersistable
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
                this.body = err.data;
            } else {
                this.body = err.message;
            }
        }
    });

    router.get('/api/v1/query', function* (next : Koa.Context) {
        yield serverApiContext.queryEngine.runQuery(this.query.query)
            .then((result) => this.body = result);
    });

    router.get('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .getItem<Persistable>(typeMap[this.params.route], this.params.route, this.params.id)
            .then((data) => this.body = data.serialize());
    });

    router.get('/api/v1/:route', function* (next : Koa.Context) {
        yield serverApiContext
            .getCollection<Persistable>(typeMap[this.params.route], this.params.route, this.query)
            .then((data) => this.body = data.map((datum) => datum.serialize()));
    });

    router.post('/api/v1/:route', function* (next : Koa.Context) {
        yield serverApiContext
            .postItem<Persistable>(typeMap[this.params.route],this.params.route, Object.assign(this.request.body,{
                creator: this.req.user.uid
            }))
            .then((data) => this.body = data);
    });

    router.put('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .putItem<Persistable>(typeMap[this.params.route], this.params.route, this.params.id, this.request.body)
            .then((data) => this.body = data);
    });

    router.patch('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .patchItem<Persistable>(typeMap[this.params.route], this.params.route, this.params.id, this.request.body)
            .then((data) => this.body = data);
    });

    router.del('/api/v1/:route/:id', function* (next : Koa.Context) {
        yield serverApiContext
            .delItem<Persistable>(typeMap[this.params.route], this.params.route, this.params.id)
            .then((data) => this.body = data);
    });

    return router;
};


