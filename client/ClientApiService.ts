/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../common/ApiService';
import { PersistentObject } from '../common/datamodel/PersistentObject';

export { AppUrls } from '../common/ApiService';

export class ClientApiService implements ApiService {
    public getItem<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T> {
        return fetch(`/api/v1/${baseUrl}/${uid}`)
            .then((response) => response.json())
            .then((data) => new obj().fromJson(data));
    }

    public getCollection<T extends PersistentObject>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
        return fetch(`/api/v1/${baseUrl}`)
            .then((response) => response.json())
            .then((data) => data.map((datum) => new obj().fromJson(datum)));
    }

    public postItem<T extends PersistentObject>(baseUrl : string, data: T)  : Promise<boolean> {
        return Promise.resolve(true);
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