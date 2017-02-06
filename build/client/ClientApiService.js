/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var falcon_core_1 = require("@digihum/falcon-core");
var queryString = require("querystring");
var lodash_1 = require("lodash");
var Exceptions_1 = require("../common/Exceptions");
var ApiService_1 = require("../common/ApiService");
exports.AppUrls = ApiService_1.AppUrls;
function handleErrors(response) {
    if (!response.ok) {
        if (response.status === 422) {
            throw new Exceptions_1.UnprocessableEntity(response.statusText, response.json().then(function (result) { return result.data; }));
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
var ClientApiService = (function () {
    function ClientApiService() {
    }
    ClientApiService.prototype.getItem = function (obj, baseUrl, uid) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL)
            .then(handleErrors)
            .then(function (response) { return response.json(); })
            .then(function (data) { return falcon_core_1.Serializer.fromJson(obj, data); });
    };
    ClientApiService.prototype.getCollection = function (obj, baseUrl, params) {
        return fetch("/api/v1/" + baseUrl + "?" + queryString.stringify(params))
            .then(handleErrors)
            .then(function (response) { return response.json(); })
            .then(function (data) { return data.map(function (datum) { return falcon_core_1.Serializer.fromJson(obj, datum); }); });
    };
    ClientApiService.prototype.postItem = function (obj, baseUrl, data, params) {
        return fetch("/api/v1/" + baseUrl + "?" + queryString.stringify(params), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors)
            .then(function (response) {
            return response.json();
        }).then(function (data) {
            return Promise.resolve(data);
        });
    };
    ClientApiService.prototype.putItem = function (obj, baseUrl, uid, data) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.patchItem = function (obj, baseUrl, uid, data) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.delItem = function (obj, baseUrl, uid) {
        var endURL = lodash_1.isObject(uid) ?
            uid.order.map(function (key) { return uid.values[key]; }).join('/')
            : uid.toString();
        return fetch("/api/v1/" + baseUrl + "/" + endURL, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
            .then(handleErrors);
    };
    ClientApiService.prototype.query = function (graphQLQueryString) {
        return fetch('/api/v1/query?query=' + graphQLQueryString)
            .then(handleErrors)
            .then(function (response) { return response.json(); });
    };
    ClientApiService.prototype.getStats = function () {
        return fetch('/stats', { credentials: 'same-origin' })
            .then(handleErrors)
            .then(function (response) { return response.json(); });
    };
    return ClientApiService;
}());
exports.ClientApiService = ClientApiService;
//# sourceMappingURL=ClientApiService.js.map