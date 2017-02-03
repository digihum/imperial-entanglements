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
const __ = require("koa-route");
const GeneralStatisticsController_1 = require("../../backend/stats/GeneralStatisticsController");
exports.stats = (db) => {
    const server = new Koa();
    server.use(__.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = yield GeneralStatisticsController_1.GeneralStatisticsController(db.query());
    })));
    return server;
};
//# sourceMappingURL=stats.js.map