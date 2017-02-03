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
const Koa = require("koa");
const React = require("react");
const FalconApp_1 = require("../../common/FalconApp");
const server_1 = require("react-dom/server");
const react_router_1 = require("react-router");
const wrapDatabase_1 = require("../../backend/data/wrapDatabase");
const Index_1 = require("../../common/Index");
const Login_1 = require("../../common/Login");
exports.adminApp = (db) => {
    const server = new Koa();
    const serverRenderContext = react_router_1.createServerRenderContext();
    const serverApiContext = wrapDatabase_1.wrapDatabase(db, false);
    server.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.isAuthenticated()) {
            return yield next();
        }
        else {
            ctx.body = server_1.renderToStaticMarkup(React.createElement(Login_1.Login, null));
        }
    }));
    server.use((ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = server_1.renderToStaticMarkup(React.createElement(Index_1.Index, null,
            React.createElement(FalconApp_1.FalconApp, { router: react_router_1.ServerRouter, api: serverApiContext, routerSettings: {
                    context: serverRenderContext,
                    location: ctx.request.url
                }, environment: 'website', connected: true })));
    }));
    return server;
};
//# sourceMappingURL=adminApp.js.map