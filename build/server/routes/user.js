/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
const koaPassport = require("koa-passport");
exports.user = (db) => {
    const server = new Koa();
    server.use(__.post('/login', koaPassport.authenticate(process.env.AUTH_TYPE, {
        successRedirect: '/',
        failureRedirect: '/login'
    })));
    server.use(__.get('/logout', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.logout();
        ctx.redirect('/');
    })));
    server.use(__.get('/currentuser', (ctx) => __awaiter(this, void 0, void 0, function* () {
        ctx.body = {
            username: ctx.req.user.name
        };
    })));
    server.use(__.get('/tabset', (ctx) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.isAuthenticated()) {
            ctx.body = yield db.query()('tabset').where({ owner: ctx.req.user.uid })
                .then((res) => res.map((tabset) => (__assign({}, tabset, { tabs: JSON.parse(tabset.tabs) }))));
        }
    })));
    server.use(__.post('/tabset', (ctx) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.isAuthenticated()) {
            yield db.query()('tabset')
                .insert({ owner: ctx.req.user.uid, name: ctx.request.body.name, tabs: JSON.stringify(ctx.request.body.tabs) })
                .then(() => { });
            ctx.body = 1;
        }
    })));
    server.use(__.delete('/tabset/:id', (ctx, id) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.isAuthenticated()) {
            yield db.query()('tabset')
                .where({ uid: id, owner: ctx.req.user.uid })
                .del()
                .then(() => { });
            ctx.body = 1;
        }
    })));
    // create user
    // delete user
    // reset user password
    // change user permission
    return server;
};
//# sourceMappingURL=user.js.map