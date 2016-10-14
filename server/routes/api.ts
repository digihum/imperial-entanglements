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
import { Persistable } from '../core/Persistable';

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

export const wrapDatabase : (s: Database) => ServerApiService = (db: Database) => {
    const routes = new Map<string, IController>([
        [AppUrls.elementSet, new ElementSetController(db)],
        [AppUrls.record, new RecordController(db)],
        [AppUrls.entityType, new EntityTypeController(db)],
        [AppUrls.entity, new EntityController(db)],
        [AppUrls.predicate, new PredicateController(db)],
        [AppUrls.source, new SourceController(db)],
        [AppUrls.element, new ElementController(db)],
        [AppUrls.sourceElement, new SourceElementController(db)]
    ]);

    return new ServerApiService(routes);
};

export const api : (router: KoaRouter, s: ServerApiService) => KoaRouter
    = (router: KoaRouter, serverApiContext: ServerApiService) => {

    const typeMap = {
        [AppUrls.elementSet]: ElementSetPersistable,
        [AppUrls.record]: RecordPersistable,
        [AppUrls.entityType]: EntityTypePersistable,
        [AppUrls.entity]: EntityPersistable,
        [AppUrls.predicate] : PredicatePersistable,
        [AppUrls.source] : SourcePersistable,
        [AppUrls.element] : ElementPersistable,
        [AppUrls.sourceElement]: SourceElementPersistable
    };

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
                default:
                    this.status = 500;
            }
            this.body = err.message;
        }
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
            .postItem<Persistable>(typeMap[this.params.route],this.params.route, this.request.body)
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


