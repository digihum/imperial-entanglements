/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var Exceptions_1 = require("../common/Exceptions");
var moment = require("moment");
var ApiService_1 = require("../common/ApiService");
exports.AppUrls = ApiService_1.AppUrls;
var GeneralStatisticsController_1 = require("./stats/GeneralStatisticsController");
var ServerApiService = (function () {
    function ServerApiService(db, routesMap, queryEngine, fakeCreator) {
        this.controllerMap = routesMap;
        this.queryEngine = queryEngine;
        this.fakeCreator = fakeCreator;
        this.db = db;
    }
    ServerApiService.prototype.getItem = function (obj, baseUrl, uid) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.getItemJson(obj, uid);
    };
    ServerApiService.prototype.getCollection = function (obj, baseUrl, params) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.getCollectionJson(obj, params);
    };
    ServerApiService.prototype.postItem = function (obj, baseUrl, data, params) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.postItem(obj, Object.assign(data, {
            creationTimestamp: moment().toISOString(),
            lastmodifiedTimestamp: moment().toISOString(),
            creator: this.fakeCreator ? 0 : data.creator
        }), params);
    };
    ServerApiService.prototype.putItem = function (obj, baseUrl, uid, data) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.putItem(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }));
    };
    ServerApiService.prototype.patchItem = function (obj, baseUrl, uid, data) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.patchItem(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }));
    };
    ServerApiService.prototype.delItem = function (obj, baseUrl, uid) {
        var controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.deleteItem(obj, uid);
    };
    ServerApiService.prototype.query = function (graphQLQuery) {
        return Promise.resolve({});
    };
    ServerApiService.prototype.getStats = function () {
        return GeneralStatisticsController_1.GeneralStatisticsController(this.db.query());
    };
    return ServerApiService;
}());
exports.ServerApiService = ServerApiService;
//# sourceMappingURL=ServerApiService.js.map