/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const falcon_core_1 = require("@digihum/falcon-core");
const queryString = require("querystring");
const lodash_1 = require("lodash");
const Exceptions_1 = require("../common/Exceptions");
var ApiService_1 = require("../common/ApiService");
exports.AppUrls = ApiService_1.AppUrls;
function handleErrors(response) {
    if (!response.ok) {
        if (response.status === 422) {
            throw new Exceptions_1.UnprocessableEntity(response.statusText, response.json().then((result) => result.data));
        }
        // showToast.dispatch('Something went wrong ;(', response.statusText);
        if (response.status === 404) {
            throw new Exceptions_1.KeyNotFoundException(JSON.stringify({
                statusText: response.statusText,
                status: response.status
            }));
        }
    }
    return response;
}
class ClientApiService {
    getItem(obj, baseUrl, uid) {
        const endURL = lodash_1.isObject(uid) ?
            uid.order.map((key) => uid.values[key]).join('/')
            : uid.toString();
        return fetch(`/api/v1/${baseUrl}/${endURL}`)
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => falcon_core_1.Serializer.fromJson(obj, data));
    }
    getCollection(obj, baseUrl, params) {
        return fetch(`/api/v1/${baseUrl}?` + queryString.stringify(params))
            .then(handleErrors)
            .then((response) => response.json())
            .then((data) => data.map((datum) => falcon_core_1.Serializer.fromJson(obj, datum)));
    }
    postItem(obj, baseUrl, data, params) {
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
    putItem(obj, baseUrl, uid, data) {
        const endURL = lodash_1.isObject(uid) ?
            uid.order.map((key) => uid.values[key]).join('/')
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
    patchItem(obj, baseUrl, uid, data) {
        const endURL = lodash_1.isObject(uid) ?
            uid.order.map((key) => uid.values[key]).join('/')
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
    delItem(obj, baseUrl, uid) {
        const endURL = lodash_1.isObject(uid) ?
            uid.order.map((key) => uid.values[key]).join('/')
            : uid.toString();
        return fetch(`/api/v1/${baseUrl}/${endURL}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
            .then(handleErrors);
    }
    query(graphQLQueryString) {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then((response) => response.json());
    }
    getStats() {
        return fetch('/stats', { credentials: 'same-origin' })
            .then(handleErrors)
            .then((response) => response.json());
    }
}
exports.ClientApiService = ClientApiService;
//# sourceMappingURL=ClientApiService.js.map