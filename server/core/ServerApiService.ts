/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../../common/ApiService';
import { PersistentObject } from '../../common/datamodel/PersistentObject';
import { IController } from '../controllers/IController';

export class ServerApiService implements ApiService {

    private controllerMap: Map<string, IController>;

    constructor(routesMap: Map<string, IController>) {
        this.controllerMap = routesMap;
    }

    public getItem<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject('Controller not found');
        }
        return controller.getItemJson<T>(obj, uid);
    }

    public getCollection<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string) : Promise<T[]> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject('Controller not found');
        }
        return controller.getCollectionJson<T>(obj, {});
    }

    public postItem<T extends PersistentObject>(baseUrl : string, data: T)  : Promise<boolean> {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject('Controller not found');
        }
        return controller.postItem<T>(data);
    }

    public putItem<T extends PersistentObject>(baseUrl : string, uid: number, data: T) : Promise<boolean> {
        return Promise.resolve(true);
    }

    public patchItem<T extends PersistentObject>(baseUrl : string, uid: number, data : T) : Promise<boolean> {
        return Promise.resolve(true);
    }

    public delItem<T extends PersistentObject>(baseUrl : string, uid: number) {
        return Promise.resolve(true);
    }

}