/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Vendor
const Koa = require("koa");
const __ = require("koa-route");
const koaJSON = require("koa-json");
const koaBodyParser = require("koa-bodyparser");
const wrapDatabase_1 = require("../../backend/data/wrapDatabase");
const falcon_core_1 = require("@digihum/falcon-core");
const itemTypes_1 = require("../../common/itemTypes");
const winston = require("winston");
exports.api = (db) => {
    const server = new Koa();
    server.use(koaJSON());
    server.use(koaBodyParser({
        enableTypes: ['json', 'form', 'text']
    }));
    const serverApiContext = wrapDatabase_1.wrapDatabase(db, false);
    server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.req.method === 'GET' || ctx.isAuthenticated()) {
            return yield next();
        }
        else {
            ctx.status = 403;
            ctx.body = 'You must be authorised to modify this resource';
        }
    }));
    server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield next();
        }
        catch (err) {
            switch (err.constructor.name) {
                case 'KeyNotFoundException':
                    ctx.status = 404;
                    break;
                case 'CollectionNotFoundException':
                    ctx.status = 404;
                    break;
                case 'OperationNotPermittedException':
                    ctx.status = 422;
                    break;
                default:
                    ctx.status = 500;
            }
            ctx.type = 'application/json';
            if (err.data !== undefined) {
                return yield err.data.data.then((data) => {
                    ctx.body = JSON.stringify(Object.assign({}, err.data, { data: data }));
                });
            }
            else {
                ctx.body = err.message;
            }
        }
    }));
    server.use(__.get('/query', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = yield serverApiContext.queryEngine.runQuery(ctx.query.query);
    })));
    server.use(__.get('/:route/:id+', (ctx, route, ...ids) => __awaiter(this, void 0, void 0, function* () {
        const data = yield serverApiContext
            .getItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids));
        ctx.body = falcon_core_1.Serializer.toJson(data);
    })));
    server.use(__.get('/:route', (ctx, route) => __awaiter(this, void 0, void 0, function* () {
        const data = yield serverApiContext
            .getCollection(itemTypes_1.itemTypes[route].item, route, ctx.query);
        ctx.body = data.map((datum) => falcon_core_1.Serializer.toJson(datum));
    })));
    server.use(__.post('/:route', (ctx, route) => __awaiter(this, void 0, void 0, function* () {
        const profileName = `Creating new ${route} at ${Date.now()}`;
        winston.profile(profileName);
        const data = yield serverApiContext
            .postItem(itemTypes_1.itemTypes[route].item, route, falcon_core_1.Serializer.fromJson(itemTypes_1.itemTypes[route].item, Object.assign(ctx.request.body, {
            creator: ctx.req.user.uid
        })), ctx.query);
        ctx.body = data;
        winston.profile(profileName);
    })));
    server.use(__.put('/:route/:id+', (ctx, route, ...ids) => __awaiter(this, void 0, void 0, function* () {
        const profileName = `Replacing new ${route} at ${Date.now()}`;
        winston.profile(profileName);
        const data = yield serverApiContext
            .putItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids), falcon_core_1.Serializer.fromJson(itemTypes_1.itemTypes[route].item, ctx.request.body));
        ctx.body = data;
        winston.profile(profileName);
    })));
    server.use(__.patch('/:route/:id+', (ctx, route, ...ids) => __awaiter(this, void 0, void 0, function* () {
        const profileName = `Updating new ${route} at ${Date.now()}`;
        winston.profile(profileName);
        const data = yield serverApiContext
            .patchItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids), ctx.request.body);
        ctx.body = data;
        winston.profile(profileName);
    })));
    server.use(__.del('/:route/:id+', (ctx, route, ...ids) => __awaiter(this, void 0, void 0, function* () {
        const profileName = `Replacing new ${route} at ${Date.now()}`;
        winston.profile(profileName);
        const data = yield serverApiContext
            .delItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids));
        ctx.body = data;
        winston.profile(profileName);
    })));
    return server;
};
//# sourceMappingURL=api.js.map