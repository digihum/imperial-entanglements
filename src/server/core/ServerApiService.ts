/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../../common/ApiService';
import { Persistable } from './Persistable';
import { IController } from '../controllers/IController';
import { CollectionNotFoundException } from './Exceptions';

import { QueryEngine } from './QueryEngine';

import { CompositeKey } from '../../common/datamodel/Serializable';

import * as moment from 'moment';

import { triggerReload } from '../../common/Signaller';

export { AppUrls } from '../../common/ApiService';

import { Database } from './Database';

import { GeneralStatisticsController } from '../stats/GeneralStatisticsController';

export class ServerApiService implements ApiService {

    private controllerMap: Map<string, IController>;
    private db: Database;

    public queryEngine: QueryEngine;
    public fakeCreator: boolean;

    constructor(db: Database, routesMap: Map<string, IController>, queryEngine: QueryEngine, fakeCreator: boolean) {
        this.controllerMap = routesMap;
        this.queryEngine = queryEngine;
        this.fakeCreator = fakeCreator;
        this.db = db;
    }

    public getItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<T> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.getItemJson<T>(obj, uid);
    }

    public getCollection<T extends Persistable>(obj: { new(): T; }, baseUrl : string, params: any) : PromiseLike<T[]> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.getCollectionJson<T>(obj, params);
    }

    public postItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, data: T)  : PromiseLike<boolean> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.postItem<T>(obj, Object.assign(data, {
            creationTimestamp: moment().toISOString(),
            lastmodifiedTimestamp: moment().toISOString(),
            creator: this.fakeCreator ? 0 : data.creator
        }))
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public putItem<T extends Persistable>(obj: { new(): T; },
            baseUrl : string, uid: number | CompositeKey, data: T) : PromiseLike<boolean> {

        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.putItem<T>(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }))
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public patchItem<T extends Persistable>(obj: { new(): T; },
            baseUrl : string, uid: number | CompositeKey, data : T) : PromiseLike<boolean> {

        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.patchItem<T>(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }))
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public delItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.deleteItem<T>(obj, uid)
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }


    public query(graphQLQuery: string) : PromiseLike<any> {
        return Promise.resolve({});
    }

    public getStats() : PromiseLike<any> {
      return GeneralStatisticsController(this.db.query());
    }
}
