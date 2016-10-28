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

import { triggerReload, createTab } from '../../common/Signaller';

export { AppUrls } from '../../common/ApiService';

export class ServerApiService implements ApiService {

    private controllerMap: Map<string, IController>;

    public queryEngine: QueryEngine;

    constructor(routesMap: Map<string, IController>, queryEngine: QueryEngine) {
        this.controllerMap = routesMap;
        this.queryEngine = queryEngine;
    }

    public getItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.getItemJson<T>(obj, uid);
    }

    public getCollection<T extends Persistable>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.getCollectionJson<T>(obj, params);
    }

    public postItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, data: T)  : Promise<boolean> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.postItem<T>(obj, data)
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public putItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number, data: T) : Promise<boolean> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.putItem<T>(obj, uid, data)
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public patchItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number, data : T) : Promise<boolean> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new CollectionNotFoundException('Controller not found'));
        }
        return controller.patchItem<T>(obj, uid, data)
        .then((result) => {
            triggerReload.dispatch();
            return Promise.resolve(result);
        });
    }

    public delItem<T extends Persistable>(obj: { new(): T; }, baseUrl : string, uid: number) {
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

}