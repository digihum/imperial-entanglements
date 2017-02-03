/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { ApiService } from '../common/ApiService';
import { Serializer, TrackedFalconItem, CompositeKey } from '@digihum/falcon-core';
import * as queryString from 'query-string';

import { isObject } from 'lodash';

import { UnprocessableEntity, KeyNotFoundException } from '../common/Exceptions';

export { AppUrls } from '../common/ApiService';

function handleErrors(response: any) {
    if (!response.ok) {

        if (response.status === 422) {
            throw new UnprocessableEntity(response.statusText, response.json().then((result) => result.data));
        }

        // showToast.dispatch('Something went wrong ;(', response.statusText);

        if (response.status === 404) {
             throw new KeyNotFoundException(JSON.stringify({
                statusText: response.statusText,
                status: response.status
            }));
        }
    }
    return response;
}

export class ClientApiService implements ApiService {
    public getItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<T> {

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`)
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => Serializer.fromJson(obj, data));
    }

    public getCollection<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, params: any) : Promise<T[]> {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params))
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => data.map((datum) => Serializer.fromJson(obj, datum)));
    }

    public postItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, data: T, params: any) : Promise<number[]> {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(handleErrors)
        .then((response) => {
            return response.json();
        }).then((data) => {
            return Promise.resolve(data);
        });
    }

    public putItem<T extends TrackedFalconItem>(obj: { new(): T; },
            baseUrl : string, uid: number | CompositeKey, data: T) : Promise<void> {

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(handleErrors);
    }

    public patchItem<T extends TrackedFalconItem>(obj: { new(): T; },
            baseUrl : string, uid: number | CompositeKey, data : T) : Promise<void> {

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then(handleErrors);
    }

    public delItem<T extends TrackedFalconItem>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : Promise<void>{

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
        .then(handleErrors);
    }

    public query(graphQLQueryString: string) : Promise<any> {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then((response) => response.json());
    }

    public getStats() : Promise<any> {
      return fetch('/stats', { credentials: 'same-origin' })
        .then(handleErrors)
        .then((response) => response.json());
    }
}
