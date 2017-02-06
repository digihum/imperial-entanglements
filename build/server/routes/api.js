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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Vendor
var Koa = require("koa");
var __ = require("koa-route");
var koaJSON = require("koa-json");
var koaBodyParser = require("koa-bodyparser");
var wrapDatabase_1 = require("../../backend/data/wrapDatabase");
var falcon_core_1 = require("@digihum/falcon-core");
var itemTypes_1 = require("../../common/itemTypes");
var winston = require("winston");
exports.api = function (db) {
    var server = new Koa();
    server.use(koaJSON());
    server.use(koaBodyParser({
        enableTypes: ['json', 'form', 'text']
    }));
    var serverApiContext = wrapDatabase_1.wrapDatabase(db, false);
    server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(ctx.req.method === 'GET' || ctx.isAuthenticated())) return [3 /*break*/, 2];
                    return [4 /*yield*/, next()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    ctx.status = 403;
                    ctx.body = 'You must be authorised to modify this resource';
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 6]);
                    return [4 /*yield*/, next()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_1 = _a.sent();
                    switch (err_1.constructor.name) {
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
                    if (!(err_1.data !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, err_1.data.data.then(function (data) {
                            ctx.body = JSON.stringify(Object.assign({}, err_1.data, { data: data }));
                        })];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    ctx.body = err_1.message;
                    _a.label = 5;
                case 5: return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    server.use(__.get('/query', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = ctx;
                    return [4 /*yield*/, serverApiContext.queryEngine.runQuery(ctx.query.query)];
                case 1:
                    _a.body = _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }));
    server.use(__.get('/:route/:id+', function (ctx, route) {
        var ids = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ids[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, serverApiContext
                            .getItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids))];
                    case 1:
                        data = _a.sent();
                        ctx.body = falcon_core_1.Serializer.toJson(data);
                        return [2 /*return*/];
                }
            });
        });
    }));
    server.use(__.get('/:route', function (ctx, route) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverApiContext
                        .getCollection(itemTypes_1.itemTypes[route].item, route, ctx.query)];
                case 1:
                    data = _a.sent();
                    ctx.body = data.map(function (datum) { return falcon_core_1.Serializer.toJson(datum); });
                    return [2 /*return*/];
            }
        });
    }); }));
    server.use(__.post('/:route', function (ctx, route) { return __awaiter(_this, void 0, void 0, function () {
        var profileName, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profileName = "Creating new " + route + " at " + Date.now();
                    winston.profile(profileName);
                    return [4 /*yield*/, serverApiContext
                            .postItem(itemTypes_1.itemTypes[route].item, route, falcon_core_1.Serializer.fromJson(itemTypes_1.itemTypes[route].item, Object.assign(ctx.request.body, {
                            creator: ctx.req.user.uid
                        })), ctx.query)];
                case 1:
                    data = _a.sent();
                    ctx.body = data;
                    winston.profile(profileName);
                    return [2 /*return*/];
            }
        });
    }); }));
    server.use(__.put('/:route/:id+', function (ctx, route) {
        var ids = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ids[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var profileName, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profileName = "Replacing new " + route + " at " + Date.now();
                        winston.profile(profileName);
                        return [4 /*yield*/, serverApiContext
                                .putItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids), falcon_core_1.Serializer.fromJson(itemTypes_1.itemTypes[route].item, ctx.request.body))];
                    case 1:
                        data = _a.sent();
                        ctx.body = data;
                        winston.profile(profileName);
                        return [2 /*return*/];
                }
            });
        });
    }));
    server.use(__.patch('/:route/:id+', function (ctx, route) {
        var ids = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ids[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var profileName, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profileName = "Updating new " + route + " at " + Date.now();
                        winston.profile(profileName);
                        return [4 /*yield*/, serverApiContext
                                .patchItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids), ctx.request.body)];
                    case 1:
                        data = _a.sent();
                        ctx.body = data;
                        winston.profile(profileName);
                        return [2 /*return*/];
                }
            });
        });
    }));
    server.use(__.del('/:route/:id+', function (ctx, route) {
        var ids = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            ids[_i - 2] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var profileName, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profileName = "Replacing new " + route + " at " + Date.now();
                        winston.profile(profileName);
                        return [4 /*yield*/, serverApiContext
                                .delItem(itemTypes_1.itemTypes[route].item, route, itemTypes_1.itemTypes[route].buildKey(ids))];
                    case 1:
                        data = _a.sent();
                        ctx.body = data;
                        winston.profile(profileName);
                        return [2 /*return*/];
                }
            });
        });
    }));
    return server;
};
//# sourceMappingURL=api.js.map