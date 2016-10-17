/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../common/ApiService';
import { Serializable } from '../common/datamodel/Serializable';
import * as queryString from 'query-string';

export { AppUrls } from '../common/ApiService';

export class ClientApiService implements ApiService {
    public getItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T> {
        return fetch(`/api/v1/${baseUrl}/${uid}`)
            .then((response) => response.json())
            .then((data) => new obj().deserialize(data));
    }

    public getCollection<T extends Serializable>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params))
            .then((response) => response.json())
            .then((data) => data.map((datum) => new obj().deserialize(datum)));
    }

    public postItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, data: T)  : Promise<boolean> {
        return fetch(`/api/v1/${baseUrl}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json());
    }

    public putItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number, data: T) : Promise<boolean> {
        return fetch(`/api/v1/${baseUrl}/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json());
    }

    public patchItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number, data : T) : Promise<boolean> {
        return fetch(`/api/v1/${baseUrl}/${uid}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json());
    }

    public delItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) {
        return fetch(`/api/v1/${baseUrl}/${uid}`, {
            method: 'DELETE'
        })
        .then((response) => response.json());
    }
}