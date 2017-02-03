/**
 * @fileOverview <Description Missing>
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
const koaStatic = require("koa-static");
const koaBodyParser = require("koa-bodyparser");
const koaLogger = require("koa-logger");
const koaSession = require("koa-session");
// import * as koaConditionalGet from 'koa-conditional-get';
// import * as koaEtags from 'koa-etag';
const koaPassport = require("koa-passport");
const koaMount = require("koa-mount");
const koaConvert = require("koa-convert");
const Database_1 = require("../../backend/data/Database");
const api_1 = require("../routes/api");
const adminApp_1 = require("../routes/adminApp");
const user_1 = require("../routes/user");
const snapshot_1 = require("../routes/snapshot");
const stats_1 = require("../routes/stats");
const Auth_1 = require("./Auth");
const SqliteSnapshot_1 = require("./SqliteSnapshot");
const path = require("path");
exports.Server = (databaseConfig) => {
    const app = new Koa();
    app.use(koaConvert(koaLogger()));
    //koaQs(app, 'strict');
    app.use(koaConvert(koaBodyParser()));
    // Sessions
    app.keys = ['secret'];
    app.use(koaConvert(koaSession(app)));
    app.use(koaPassport.initialize());
    app.use(koaPassport.session());
    app.use(koaStatic(path.join(process.cwd(), 'dist', 'static')));
    const db = new Database_1.Database(databaseConfig);
    const snapshotter = new SqliteSnapshot_1.SqliteSnapshot(databaseConfig);
    Auth_1.setupAuth(db);
    app.use(koaMount('/api/v1', api_1.api(db)));
    app.use(koaMount('/', user_1.user(db)));
    app.use(koaMount('/snapshot', snapshot_1.snapshot(snapshotter)));
    app.use(koaMount('/stats', stats_1.stats(db)));
    app.use(koaMount('/', adminApp_1.adminApp(db)));
    app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = '404';
    }));
    return app;
};
//# sourceMappingURL=Server.js.map