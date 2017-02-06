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
var Koa = require("koa");
var React = require("react");
var FalconApp_1 = require("../../common/FalconApp");
var server_1 = require("react-dom/server");
var react_router_1 = require("react-router");
var wrapDatabase_1 = require("../../backend/data/wrapDatabase");
var Index_1 = require("../../common/Index");
var Login_1 = require("../../common/Login");
exports.adminApp = function (db) {
    var server = new Koa();
    var serverRenderContext = react_router_1.createServerRenderContext();
    var serverApiContext = wrapDatabase_1.wrapDatabase(db, false);
    server.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ctx.isAuthenticated()) return [3 /*break*/, 2];
                    return [4 /*yield*/, next()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    ctx.body = server_1.renderToStaticMarkup(React.createElement(Login_1.Login, null));
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.use(function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            ctx.body = server_1.renderToStaticMarkup(React.createElement(Index_1.Index, null,
                React.createElement(FalconApp_1.FalconApp, { router: react_router_1.ServerRouter, api: serverApiContext, routerSettings: {
                        context: serverRenderContext,
                        location: ctx.request.url
                    }, environment: 'website', connected: true })));
            return [2 /*return*/];
        });
    }); });
    return server;
};
//# sourceMappingURL=adminApp.js.map