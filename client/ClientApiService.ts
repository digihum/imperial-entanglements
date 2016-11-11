/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { ApiService } from '../common/ApiService';
import { Serializable, CompositeKey } from '../common/datamodel/Serializable';
import * as queryString from 'query-string';

import { triggerReload, showToast } from '../common/Signaller';

import { isObject } from 'lodash';

import { UnprocessableEntity } from '../common/Exceptions';

import * as toastr from 'toastr';

export { AppUrls } from '../common/ApiService';


function handleErrors(response: any) {
    if (!response.ok) {

        if (response.status === 422) {
            throw new UnprocessableEntity(response.statusText, response.json());
        }

        showToast.dispatch('Something went wrong ;(', response.statusText);
        triggerReload.dispatch();

        if (response.status === 404) {
             throw Error(JSON.stringify({
                statusText: response.statusText,
                status: response.status
            }));
        }
    }
    return response;
}

export class ClientApiService implements ApiService {
    public getItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) : PromiseLike<T> {

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`)
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => new obj().deserialize(data));
    }

    public getCollection<T extends Serializable>(obj: { new(): T; }, baseUrl : string, params: any) : PromiseLike<T[]> {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params))
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => data.map((datum) => new obj().deserialize(datum)));
    }

    public postItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, data: T)  : PromiseLike<boolean> {
        return fetch(`/api/v1/${baseUrl}`, {
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
            triggerReload.dispatch();
            return response.json();
        }).then((data) => {
            return Promise.resolve(data);
        });
    }

    public putItem<T extends Serializable>(obj: { new(): T; }, 
            baseUrl : string, uid: number | CompositeKey, data: T) : PromiseLike<boolean> {

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
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
    }

    public patchItem<T extends Serializable>(obj: { new(): T; },
            baseUrl : string, uid: number | CompositeKey, data : T) : PromiseLike<boolean> {

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
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
    }

    public delItem<T extends Serializable>(obj: { new(): T; }, baseUrl : string, uid: number | CompositeKey) {

        const endURL = isObject(uid) ?
            (<CompositeKey> uid).order.map((key) => (<CompositeKey> uid).values[key]).join('/')
            : uid.toString();

        return fetch(`/api/v1/${baseUrl}/${endURL}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
        .then(handleErrors)
        .then((response) => {
            triggerReload.dispatch();
            return response.json();
        });
    }

    public query(graphQLQueryString: string) : PromiseLike<any> {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then((response) => response.json());
    }
}