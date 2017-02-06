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
var koaPassport = require("koa-passport");
exports.user = function (db) {
    var server = new Koa();
    server.use(__.post('/login', koaPassport.authenticate(process.env.AUTH_TYPE, {
        successRedirect: '/',
        failureRedirect: '/login'
    })));
    server.use(__.get('/logout', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            ctx.logout();
            ctx.redirect('/');
            return [2 /*return*/];
        });
    }); }));
    server.use(__.get('/currentuser', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            ctx.body = {
                username: ctx.req.user.name
            };
            return [2 /*return*/];
        });
    }); }));
    server.use(__.get('/tabset', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!ctx.isAuthenticated()) return [3 /*break*/, 2];
                    _a = ctx;
                    return [4 /*yield*/, db.query()('tabset').where({ owner: ctx.req.user.uid })
                            .then(function (res) { return res.map(function (tabset) { return (__assign({}, tabset, { tabs: JSON.parse(tabset.tabs) })); }); })];
                case 1:
                    _a.body = _b.sent();
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }));
    server.use(__.post('/tabset', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ctx.isAuthenticated()) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.query()('tabset')
                            .insert({ owner: ctx.req.user.uid, name: ctx.request.body.name, tabs: JSON.stringify(ctx.request.body.tabs) })
                            .then(function () { })];
                case 1:
                    _a.sent();
                    ctx.body = 1;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }));
    server.use(__.delete('/tabset/:id', function (ctx, id) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!ctx.isAuthenticated()) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.query()('tabset')
                            .where({ uid: id, owner: ctx.req.user.uid })
                            .del()
                            .then(function () { })];
                case 1:
                    _a.sent();
                    ctx.body = 1;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }));
    // create user
    // delete user
    // reset user password
    // change user permission
    return server;
};
//# sourceMappingURL=user.js.map