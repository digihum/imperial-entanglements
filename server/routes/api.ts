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
import { ServerApiService } from '../core/ServerApiService';

// Controllers
import { IController } from '../controllers/IController';

import { EntityController } from '../controllers/EntityController';
import { GenericController } from '../controllers/GenericController';

// Models
import { ElementSet } from '../../common/datamodel/AbstractSource';
import { Record } from '../../common/datamodel/Record';
import { EntityType } from '../../common/datamodel/EntityType';
import { Entity } from '../../common/datamodel/Entity';

// Routes
import { AppUrls } from '../../common/routeUrls';

export const wrapDatabase : (s: Database) => ServerApiService = (db: Database) => {
    const routes = new Map<string, IController>([
        [AppUrls.elementSet, new GenericController<ElementSet>(db, 'element_sets')],
        [AppUrls.record, new GenericController<Record>(db, 'records')],
        [AppUrls.entityType, new GenericController<EntityType>(db, 'entity_types')],
        [AppUrls.entity, new GenericController<Entity>(db, 'entities')]
    ]);

    return new ServerApiService(routes);
};

export const api : (router: KoaRouter, s: ServerApiService) => KoaRouter
    = (router: KoaRouter, serverApiContext: ServerApiService) => {

    const typeMap = {
        [AppUrls.elementSet]: ElementSet,
        [AppUrls.record]: Record,
        [AppUrls.entityType]: EntityType,
        [AppUrls.entity]: Entity
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

    router.get(`/api/v1/:route/:id`, function* (next : Koa.Context) {
        yield serverApiContext
            .getItem<any>(typeMap[this.params.route], this.params.route, this.params.id)
            .then((data) => this.body = data);
    });

    router.get(`/api/v1/:route`, function* (next : Koa.Context) {
        yield serverApiContext
            .getCollection<any>(typeMap[this.params.route], this.params.route)
            .then((data) => this.body = data);
    });

    router.post(`/api/v1/:route`, function* (next : Koa.Context) {
        yield serverApiContext
            .postItem<any>(this.params.route, this.request.body)
            .then((data) => this.body = data);
    });

    router.put(`/api/v1/:route/:id`, function* (next : Koa.Context) {
        yield serverApiContext
            .putItem<any>(this.params.route, this.params.id, this.request.body)
            .then((data) => this.body = data);
    });

    router.patch(`/api/v1/:route/:id`, function* (next : Koa.Context) {
        yield serverApiContext
            .patchItem<any>(this.params.route, this.params.id, this.request.body)
            .then((data) => this.body = data);
    });

    router.del(`/api/v1/:route/:id`, function* (next : Koa.Context) {
        yield serverApiContext
            .delItem<any>(this.params.route, this.params.id)
            .then((data) => this.body = data);
    });

    return router;
};


