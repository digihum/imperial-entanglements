/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../common/ApiService';
import { Serializable } from '../common/datamodel/Serializable';
import * as queryString from 'query-string';

import { triggerReload } from '../common/Signaller';

export { AppUrls } from '../common/ApiService';

function handleErrors(response: any) {
    if (!response.ok) {

        if (response.status === 404) {
             throw Error(JSON.stringify({
                statusText: response.statusText,
                status: response.status
            }));
        }

        response.json().then((data) => {
            throw Error(JSON.stringify({
                data,
                statusText: response.statusText,
                status: response.status
            }));
        });
    }
    return response;
}

export class ClientApiService implements ApiService {
    public getItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) : Promise<T> {
        return fetch(`/api/v1/${baseUrl}/${uid}`)
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => new obj().deserialize(data));
    }

    public getCollection<T extends Serializable>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params))
            .then(handleErrors)
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
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
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
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
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
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
    }

    public delItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number) {
        return fetch(`/api/v1/${baseUrl}/${uid}`, {
            method: 'DELETE'
        })
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
    }

    public query(graphQLQueryString: string) : Promise<any> {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then((response) => response.json());
    }
}