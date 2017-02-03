/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const Exceptions_1 = require("../common/Exceptions");
const moment = require("moment");
var ApiService_1 = require("../common/ApiService");
exports.AppUrls = ApiService_1.AppUrls;
const GeneralStatisticsController_1 = require("./stats/GeneralStatisticsController");
class ServerApiService {
    constructor(db, routesMap, queryEngine, fakeCreator) {
        this.controllerMap = routesMap;
        this.queryEngine = queryEngine;
        this.fakeCreator = fakeCreator;
        this.db = db;
    }
    getItem(obj, baseUrl, uid) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.getItemJson(obj, uid);
    }
    getCollection(obj, baseUrl, params) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.getCollectionJson(obj, params);
    }
    postItem(obj, baseUrl, data, params) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.postItem(obj, Object.assign(data, {
            creationTimestamp: moment().toISOString(),
            lastmodifiedTimestamp: moment().toISOString(),
            creator: this.fakeCreator ? 0 : data.creator
        }), params);
    }
    putItem(obj, baseUrl, uid, data) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.putItem(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }));
    }
    patchItem(obj, baseUrl, uid, data) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.patchItem(obj, uid, Object.assign(data, {
            lastmodifiedTimestamp: moment().toISOString()
        }));
    }
    delItem(obj, baseUrl, uid) {
        const controller = this.controllerMap.get(baseUrl);
        if (controller === undefined) {
            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
        }
        return controller.deleteItem(obj, uid);
    }
    query(graphQLQuery) {
        return Promise.resolve({});
    }
    getStats() {
        return GeneralStatisticsController_1.GeneralStatisticsController(this.db.query());
    }
}
exports.ServerApiService = ServerApiService;
//# sourceMappingURL=ServerApiService.js.map