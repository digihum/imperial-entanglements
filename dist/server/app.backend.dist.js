/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Entry point for server application
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Server_1 = __webpack_require__(1);
	const dotenv_1 = __webpack_require__(47);
	dotenv_1.config();
	const server = new Server_1.Server();
	const databaseConnection = {
	    useNullAsDefault: true,
	    connection: {}
	};
	if (process.env.DB_TYPE === 'sqlite') {
	    databaseConnection.client = 'sqlite3';
	    if (databaseConnection.connection !== undefined) {
	        databaseConnection.connection.filename = './data/mydb.sqlite';
	    }
	    databaseConnection.pool = {
	        afterCreate: (conn, cb) => {
	            conn.run('PRAGMA foreign_keys = ON', cb);
	        }
	    };
	}
	if (process.env.DB_TYPE === 'postgres') {
	    databaseConnection.client = 'pg';
	    databaseConnection.connection.host = process.env.DB_HOST;
	    databaseConnection.connection.user = process.env.DB_USER;
	    databaseConnection.connection.password = process.env.DB_PASSWORD;
	    databaseConnection.connection.database = process.env.DB_DATABASE;
	}
	server.init(databaseConnection);
	server.listen();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const Koa = __webpack_require__(2);
	const koaStatic = __webpack_require__(3);
	const koaBodyParser = __webpack_require__(4);
	const koaQs = __webpack_require__(5);
	const koaLogger = __webpack_require__(6);
	const koaSession = __webpack_require__(7);
	const koaPassport = __webpack_require__(8);
	const koaMount = __webpack_require__(9);
	const koaConvert = __webpack_require__(10);
	const Database_1 = __webpack_require__(11);
	const lodash_1 = __webpack_require__(13);
	const fs_1 = __webpack_require__(15);
	const api_1 = __webpack_require__(16);
	const Auth_1 = __webpack_require__(42);
	const SqliteSnapshot_1 = __webpack_require__(45);
	const path = __webpack_require__(46);
	class Server {
	    init(databaseConfig) {
	        this.app = new Koa();
	        this.app.use(koaConvert(koaLogger()));
	        koaQs(this.app, 'strict');
	        this.app.use(koaConvert(koaBodyParser()));
	        // Sessions
	        this.app.keys = ['secret'];
	        this.app.use(koaConvert(koaSession(this.app)));
	        this.app.use(koaPassport.initialize());
	        this.app.use(koaPassport.session());
	        this.app.use(koaStatic(path.join(process.cwd(), 'dist', 'server', 'static')));
	        this.skeleton = lodash_1.template(fs_1.readFileSync(path.join(process.cwd(), 'dist', 'server', 'index.html'), 'utf8'));
	        this.apiRoute = 'api/v1';
	        this.adminRoute = 'admin';
	        this.adminEditRoute = 'edit';
	        const db = new Database_1.Database(databaseConfig);
	        this.snapshot = new SqliteSnapshot_1.SqliteSnapshot(databaseConfig);
	        Auth_1.setupAuth(db);
	        //let router = new KoaRouter();
	        // router.use(koaJSON());
	        // router.use(koaBodyParser({
	        //     enableTypes: ['json', 'form', 'text']
	        // }));
	        // const serverApiContext = wrapDatabase(db, false);
	        // router = api(router, serverApiContext);
	        // router.get('/cat', async (ctx: Koa.Context) => {
	        //   ctx.body = 'meow';
	        // });
	        // this.app.use(router.middleware());
	        this.app.use(koaMount('/api/v1', api_1.api(db)));
	        /*
	
	        const admin = new Koa();
	        admin.use(koaMount('/', auth()));
	        admin.use(koaMount('/snapshot', snapshot(this.snapshot)));
	        admin.use(koaMount('/stats', stats(db)));
	        admin.use(koaMount('/', adminApp(this.skeleton, serverApiContext)));
	        this.app.use(koaMount('/admin', admin));
	
	        this.app.use(koaMount('/', frontendApp));
	
	        */
	        this.app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
	            ctx.body = '404';
	        }));
	    }
	    listen() {
	        this.app.listen(8080);
	    }
	}
	exports.Server = Server;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("koa");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("koa-static");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("koa-bodyparser");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("koa-qs");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("koa-logger");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("koa-session");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("koa-passport");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("koa-mount");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("koa-convert");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Knex = __webpack_require__(12);
	const lodash_1 = __webpack_require__(13);
	const Exceptions_1 = __webpack_require__(14);
	class Database {
	    constructor(config) {
	        this.knex = Knex(config);
	    }
	    query() {
	        return this.knex;
	    }
	    select(tableName, options = '*') {
	        return this.knex.select().from(tableName);
	    }
	    loadItem(a, uid) {
	        const query = this.knex.select()
	            .from(a)
	            .where({ uid: uid })
	            .first();
	        return query.then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result);
	    }
	    loadCollection(a, params) {
	        let query = this.knex.select()
	            .from(a);
	        Object.keys(params).forEach((param) => {
	            query = query.whereIn(param, params[param]);
	        });
	        return query.then((results) => results === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : results);
	    }
	    createItem(tableName, data) {
	        // throw warning if called with uid
	        // validate that everything else has been sent
	        const withoutUid = lodash_1.omit(data, ['uid']);
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx).insert(withoutUid, 'uid').returning('uid')
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            })
	                .then(trx.commit)
	                .catch(trx.rollback);
	        });
	    }
	    updateItem(tableName, data) {
	        // assert - must have uid
	        // validation?
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx)
	                .where({ 'uid': data.uid })
	                .update(data)
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            })
	                .then(trx.commit)
	                .catch(trx.rollback);
	        });
	    }
	    deleteItem(tableName, uid) {
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx)
	                .where({ uid })
	                .del()
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            })
	                .then(trx.commit)
	                .catch(trx.rollback);
	        });
	    }
	    getAncestorsOf(uid, tableName) {
	        return this.knex.raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
	                ancestor(uid) AS (
	                SELECT parent FROM parent_of WHERE uid=${uid}
	                UNION ALL
	                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
					SELECT * from ancestor`)
	            .then((result) => {
	            return result.filter((a) => a.uid !== null).map((a) => a.uid);
	        });
	    }
	    getChildrenOf(uid, tableName) {
	        return this.knex.raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
	                ancestor(parent) AS (
	                SELECT uid FROM parent_of WHERE uid=${uid}
	                UNION ALL
	                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
					SELECT * from ancestor`)
	            .then((result) => {
	            return result.filter((a) => a.parent !== null).map((a) => a.parent);
	        });
	    }
	    checkIntegrity(trx) {
	        return Promise.all([
	            this.knex.transacting(trx).select(this.knex.raw('SUM((records.value_type != predicates.range_type)) AS valid'))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid'),
	            this.knex.transacting(trx).select(this.knex.raw(`
	                SUM((
	
	                entities.type not in (
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
	                                ancestor(parent) AS (
	                                SELECT uid FROM parent_of WHERE uid=predicates.range_ref
	                                UNION ALL
	                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
	                                SELECT * from ancestor
	                )
	
	                )) as valid
	            `))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
	                .innerJoin('entities', 'entities.uid', 'records.value_entity')
	                .where('records.value_type', '=', 'entity'),
	            this.knex.transacting(trx).select(this.knex.raw(`
	               SUM((
	
	                entities.type not in (
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
	                                ancestor(parent) AS (
	                                SELECT uid FROM parent_of WHERE uid=predicates.domain
	                                UNION ALL
	                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
	                                SELECT * from ancestor
	                )
	
	                )) as valid
	            `))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
	                .innerJoin('entities', 'entities.uid', 'records.entity')
	        ]).then(([[a], [b], [c]]) => {
	            return (a.valid + b.valid + c.valid) === 0;
	        });
	    }
	}
	exports.Database = Database;


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("knex");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	class KeyNotFoundException extends Error {
	    constructor(message = 'Could not find the given key') {
	        super(message);
	        this.data = message;
	    }
	}
	exports.KeyNotFoundException = KeyNotFoundException;
	class CollectionNotFoundException extends Error {
	    constructor(message = 'Could not find the given collection') {
	        super(message);
	        this.data = message;
	    }
	}
	exports.CollectionNotFoundException = CollectionNotFoundException;
	class OperationNotPermittedException extends Error {
	    constructor(data) {
	        super(data.message);
	        this.data = data;
	    }
	}
	exports.OperationNotPermittedException = OperationNotPermittedException;
	class DatabaseIntegrityError extends Error {
	    constructor(message = `A database integrity constraint has been broken - your change has not been
	 submitted. This is likely due to a change which violates the property types model; please check the types of 
	 what you are trying to do. Please also contact the Digital Humanities team, this error should not occur.`) {
	        super(message);
	        this.data = message;
	    }
	}
	exports.DatabaseIntegrityError = DatabaseIntegrityError;
	exports.exceptions = {
	    KeyNotFoundException,
	    CollectionNotFoundException,
	    OperationNotPermittedException,
	    DatabaseIntegrityError
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Map of URIs to controllers
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	// Vendor
	const Koa = __webpack_require__(2);
	const KoaRouter = __webpack_require__(17);
	const ServerApiService_1 = __webpack_require__(18);
	const QueryEngine_1 = __webpack_require__(25);
	const koaConditionalGet = __webpack_require__(29);
	const koaEtags = __webpack_require__(30);
	const falcon_core_1 = __webpack_require__(31);
	const controllers_1 = __webpack_require__(32);
	const falcon_core_2 = __webpack_require__(31);
	exports.wrapDatabase = (db, fakeCreator) => {
	    const routes = new Map([
	        [ServerApiService_1.AppUrls.element_set, new controllers_1.ElementSetController(db)],
	        [ServerApiService_1.AppUrls.record, new controllers_1.RecordController(db)],
	        [ServerApiService_1.AppUrls.entity_type, new controllers_1.EntityTypeController(db)],
	        [ServerApiService_1.AppUrls.entity, new controllers_1.EntityController(db)],
	        [ServerApiService_1.AppUrls.predicate, new controllers_1.PredicateController(db)],
	        [ServerApiService_1.AppUrls.source, new controllers_1.SourceController(db)],
	        [ServerApiService_1.AppUrls.element, new controllers_1.ElementController(db)],
	        [ServerApiService_1.AppUrls.source_element, new controllers_1.SourceElementController(db)]
	    ]);
	    return new ServerApiService_1.ServerApiService(db, routes, new QueryEngine_1.QueryEngine(db), fakeCreator);
	};
	const sourceElementSpecial = (router, serverApiContext, typeMap) => {
	    router.use(koaConditionalGet());
	    router.use(koaEtags());
	    router.get(`/${ServerApiService_1.AppUrls.source_element}/:source/:element`, function* (ctx) {
	        yield serverApiContext
	            .getItem(typeMap[ServerApiService_1.AppUrls.source_element], ServerApiService_1.AppUrls.source_element, {
	            order: ['source', 'element'],
	            values: {
	                source: ctx.params.source,
	                element: ctx.params.element
	            }
	        })
	            .then((data) => ctx.body = falcon_core_1.Serializer.toJson(data));
	    });
	    router.put(`/${ServerApiService_1.AppUrls.source_element}/:source/:element`, function* (ctx) {
	        yield serverApiContext
	            .putItem(typeMap[ServerApiService_1.AppUrls.source_element], ServerApiService_1.AppUrls.source_element, {
	            order: ['source', 'element'],
	            values: {
	                source: ctx.params.source,
	                element: ctx.params.element
	            }
	        }, ctx.request.body)
	            .then((data) => ctx.body = data);
	    });
	    router.patch(`/${ServerApiService_1.AppUrls.source_element}/:source/:element`, function* (ctx) {
	        yield serverApiContext
	            .patchItem(typeMap[ServerApiService_1.AppUrls.source_element], ServerApiService_1.AppUrls.source_element, {
	            order: ['source', 'element'],
	            values: {
	                source: ctx.params.source,
	                element: ctx.params.element
	            }
	        }, ctx.request.body)
	            .then((data) => ctx.body = data);
	    });
	    router.del(`/${ServerApiService_1.AppUrls.source_element}/:source/:element`, function* (ctx) {
	        yield serverApiContext
	            .delItem(typeMap[ServerApiService_1.AppUrls.source_element], ServerApiService_1.AppUrls.source_element, {
	            order: ['source', 'element'],
	            values: {
	                source: ctx.params.source,
	                element: ctx.params.element
	            }
	        })
	            .then((data) => ctx.body = data);
	    });
	};
	// would be cleaner if it allowed 2nd level REST urls
	//  /entity/{entity_id}/predicate/{predicate_id}
	// /source/{source_id}/element/{element_id}
	const typeMap = {
	    [ServerApiService_1.AppUrls.element_set]: falcon_core_2.ElementSet,
	    [ServerApiService_1.AppUrls.record]: falcon_core_2.Record,
	    [ServerApiService_1.AppUrls.entity_type]: falcon_core_2.EntityType,
	    [ServerApiService_1.AppUrls.entity]: falcon_core_2.Entity,
	    [ServerApiService_1.AppUrls.predicate]: falcon_core_2.Predicate,
	    [ServerApiService_1.AppUrls.source]: falcon_core_2.Source,
	    [ServerApiService_1.AppUrls.element]: falcon_core_2.Element,
	    [ServerApiService_1.AppUrls.source_element]: falcon_core_2.SourceElement
	};
	exports.api = (db) => {
	    const server = new Koa();
	    const router = new KoaRouter();
	    // router.use(koaJSON());
	    // router.use(koaBodyParser({
	    //     enableTypes: ['json', 'form', 'text']
	    // }));
	    const serverApiContext = exports.wrapDatabase(db, false);
	    router.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
	        if (ctx.req.method === 'GET' || ctx.isAuthenticated()) {
	            return yield next();
	        }
	        else {
	            ctx.status = 403;
	            ctx.body = 'You must be authorised to modify this resource';
	        }
	    }));
	    router.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
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
	    router.get('/query', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        ctx.body = yield serverApiContext.queryEngine.runQuery(ctx.query.query);
	    }));
	    sourceElementSpecial(router, serverApiContext, typeMap);
	    router.get('/:route/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .getItem(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id));
	        ctx.body = falcon_core_1.Serializer.toJson(data);
	    }));
	    router.get('/:route', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .getCollection(typeMap[ctx.params.route], ctx.params.route, ctx.query);
	        ctx.body = data.map((datum) => falcon_core_1.Serializer.toJson(datum));
	    }));
	    router.post('/:route', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .postItem(typeMap[ctx.params.route], ctx.params.route, falcon_core_1.Serializer.fromJson(typeMap[ctx.params.route], Object.assign(ctx.request.body, {
	            creator: ctx.req.user.uid
	        })));
	        ctx.body = data;
	    }));
	    router.put('/:route/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .putItem(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id), falcon_core_1.Serializer.fromJson(typeMap[ctx.params.route], ctx.request.body));
	        ctx.body = data;
	    }));
	    router.patch('/:route/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .patchItem(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id), ctx.request.body);
	        ctx.body = data;
	    }));
	    router.del('/:route/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
	        const data = yield serverApiContext
	            .delItem(typeMap[ctx.params.route], ctx.params.route, parseInt(ctx.params.id));
	        ctx.body = data;
	    }));
	    server.use(router.routes());
	    server.use(router.allowedMethods());
	    return server;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("koa-router");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Exceptions_1 = __webpack_require__(14);
	const moment = __webpack_require__(19);
	const Signaller_1 = __webpack_require__(20);
	var ApiService_1 = __webpack_require__(22);
	exports.AppUrls = ApiService_1.AppUrls;
	const GeneralStatisticsController_1 = __webpack_require__(24);
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
	    postItem(obj, baseUrl, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.postItem(obj, Object.assign(data, {
	            creationTimestamp: moment().toISOString(),
	            lastmodifiedTimestamp: moment().toISOString(),
	            creator: this.fakeCreator ? 0 : data.creator
	        }))
	            .then((result) => {
	            Signaller_1.triggerReload.dispatch();
	            return Promise.resolve(result);
	        });
	    }
	    putItem(obj, baseUrl, uid, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.putItem(obj, uid, Object.assign(data, {
	            lastmodifiedTimestamp: moment().toISOString()
	        }))
	            .then((result) => {
	            Signaller_1.triggerReload.dispatch();
	            return Promise.resolve(result);
	        });
	    }
	    patchItem(obj, baseUrl, uid, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.patchItem(obj, uid, Object.assign(data, {
	            lastmodifiedTimestamp: moment().toISOString()
	        }))
	            .then((result) => {
	            Signaller_1.triggerReload.dispatch();
	            return Promise.resolve(result);
	        });
	    }
	    delItem(obj, baseUrl, uid) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.deleteItem(obj, uid)
	            .then((result) => {
	            Signaller_1.triggerReload.dispatch();
	            return Promise.resolve(result);
	        });
	    }
	    query(graphQLQuery) {
	        return Promise.resolve({});
	    }
	    getStats() {
	        return GeneralStatisticsController_1.GeneralStatisticsController(this.db.query());
	    }
	}
	exports.ServerApiService = ServerApiService;


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const signals = __webpack_require__(21);
	exports.createTab = new signals.Signal();
	exports.closeTab = new signals.Signal();
	exports.showModal = new signals.Signal();
	exports.triggerReload = new signals.Signal();
	exports.showToast = new signals.Signal();
	exports.Signaller = {
	    createTab: exports.createTab,
	    closeTab: exports.closeTab,
	    showModal: exports.showModal,
	    triggerReload: exports.triggerReload,
	    showToast: exports.showToast
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("signals");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const itemTypes_1 = __webpack_require__(23);
	exports.AppUrls = {
	    element_set: itemTypes_1.itemTypes.element_set.machineName,
	    record: itemTypes_1.itemTypes.record.machineName,
	    entity: itemTypes_1.itemTypes.entity.machineName,
	    entity_type: itemTypes_1.itemTypes.entity_type.machineName,
	    predicate: itemTypes_1.itemTypes.predicate.machineName,
	    source: itemTypes_1.itemTypes.source.machineName,
	    source_element: itemTypes_1.itemTypes.source_element.machineName,
	    element: 'element'
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	exports.itemTypes = {
	    element_set: {
	        machineName: 'element_set',
	        name: 'Element Set',
	        plural: 'Element Sets',
	        workspace: ''
	    },
	    record: {
	        machineName: 'record',
	        name: 'Record',
	        plural: 'Records',
	        workspace: ''
	    },
	    entity: {
	        machineName: 'entity',
	        name: 'Entity',
	        plural: 'Entities',
	        workspace: 'entity'
	    },
	    entity_type: {
	        machineName: 'entity_type',
	        name: 'Entity Type',
	        plural: 'Entity Types',
	        workspace: 'entity_type'
	    },
	    predicate: {
	        machineName: 'property',
	        name: 'Property',
	        plural: 'Properties',
	        workspace: 'predicate'
	    },
	    source: {
	        machineName: 'source',
	        name: 'Source',
	        plural: 'Sources',
	        workspace: 'source'
	    },
	    source_element: {
	        machineName: 'source_element',
	        name: 'Source Element',
	        plural: 'Source Elements',
	        workspace: ''
	    }
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Map of URIs to controllers
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	exports.GeneralStatisticsController = (db) => {
	    return Promise.all([
	        db('entities').count(),
	        db('entity_types').count(),
	        db('sources').count(),
	        db('records').count(),
	        db('predicates').count()
	    ]).then(([[entityCount], [entityTypeCount], [sourceCount], [recordCount], [predicateCount]]) => {
	        const statistics = {
	            entity: entityCount['count(*)'],
	            entityType: entityTypeCount['count(*)'],
	            source: sourceCount['count(*)'],
	            record: recordCount['count(*)'],
	            predicate: predicateCount['count(*)']
	        };
	        return statistics;
	    });
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(26);
	const entityQLType_1 = __webpack_require__(27);
	const predicateQLType_1 = __webpack_require__(28);
	class QueryEngine {
	    constructor(db) {
	        const entityType = entityQLType_1.entityQLType(db, predicateQLType_1.predicateQLType(db));
	        // Define the Query type
	        const queryType = new graphql_1.GraphQLObjectType({
	            name: 'Query',
	            fields: {
	                entity: {
	                    type: new graphql_1.GraphQLList(entityType),
	                    // `args` describes the arguments that the `user` query accepts
	                    args: {
	                        uid: { type: graphql_1.GraphQLString }
	                    },
	                    resolve: (_, { uid }) => {
	                        if (uid === undefined) {
	                            return db.query()('entities');
	                        }
	                        return db.query()('entities').where({ uid });
	                    }
	                }
	            }
	        });
	        this.schema = new graphql_1.GraphQLSchema({
	            query: queryType
	        });
	    }
	    runQuery(query) {
	        return graphql_1.graphql(this.schema, query);
	    }
	}
	exports.QueryEngine = QueryEngine;


/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(26);
	exports.entityQLType = (db, predicateType) => {
	    return new graphql_1.GraphQLObjectType({
	        name: 'Entity',
	        fields: {
	            uid: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return parent.uid;
	                }
	            },
	            label: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return parent.label;
	                }
	            },
	            type: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return db.query()('entity_types').where({ uid: parent.type }).first().then((data) => data.label);
	                }
	            },
	            predicate: {
	                type: predicateType,
	                args: {
	                    name: { type: graphql_1.GraphQLString },
	                    uid: { type: graphql_1.GraphQLString }
	                },
	                resolve: (entity, { name, uid }) => {
	                    if (name !== undefined) {
	                        return db.query()('predicates').where({ name }).first().then((predicate) => ({ predicate, entity }));
	                    }
	                    if (uid !== undefined) {
	                        return db.query()('predicates').where({ uid }).first().then((predicate) => ({ predicate, entity }));
	                    }
	                }
	            },
	            predicates: {
	                type: new graphql_1.GraphQLList(predicateType),
	                args: {
	                    names: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
	                    uids: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
	                },
	                resolve: (entity, { names, uids }) => {
	                    if (names !== undefined) {
	                        return db.query()('predicates')
	                            .whereIn('name', names)
	                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
	                    }
	                    if (uids !== undefined) {
	                        return db.query()('predicates')
	                            .whereIn('uid', uids)
	                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
	                    }
	                }
	            }
	        }
	    });
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(26);
	exports.predicateQLType = (db) => {
	    return new graphql_1.GraphQLObjectType({
	        name: 'Predicate',
	        fields: {
	            uid: {
	                type: graphql_1.GraphQLString,
	                resolve: ({ predicate }, {}) => {
	                    return predicate.uid;
	                }
	            },
	            name: {
	                type: graphql_1.GraphQLString,
	                resolve: ({ predicate }, {}) => {
	                    return predicate.label;
	                }
	            },
	            values: {
	                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
	                resolve: ({ entity, predicate }, {}) => {
	                    return db.query()('records')
	                        .select('value_string')
	                        .where({ entity: entity.uid, predicate: predicate.uid })
	                        .then((results) => results.map((result) => result.value_string));
	                }
	            }
	        }
	    });
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("koa-conditional-get");

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("koa-etag");

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = require("falcon-core");

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Collated list of controllers
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var ElementSetController_1 = __webpack_require__(33);
	exports.ElementSetController = ElementSetController_1.ElementSetController;
	var EntityController_1 = __webpack_require__(35);
	exports.EntityController = EntityController_1.EntityController;
	var EntityTypeController_1 = __webpack_require__(36);
	exports.EntityTypeController = EntityTypeController_1.EntityTypeController;
	var PredicateController_1 = __webpack_require__(37);
	exports.PredicateController = PredicateController_1.PredicateController;
	var RecordController_1 = __webpack_require__(38);
	exports.RecordController = RecordController_1.RecordController;
	var SourceController_1 = __webpack_require__(39);
	exports.SourceController = SourceController_1.SourceController;
	var ElementController_1 = __webpack_require__(40);
	exports.ElementController = ElementController_1.ElementController;
	var SourceElementController_1 = __webpack_require__(41);
	exports.SourceElementController = SourceElementController_1.SourceElementController;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
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
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const lodash_1 = __webpack_require__(13);
	class ElementSetController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'element_sets');
	    }
	    static toSchema(data) {
	        return lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'elements');
	    }
	    static fromSchema(data) {
	        return __assign({}, Object.create(falcon_core_1.ElementSet.prototype), data);
	        // return Object.assign(Object.create(ElementSet.prototype), data);
	    }
	    toSchema(data) {
	        return ElementSetController.toSchema(data);
	    }
	    fromSchema(data) {
	        return ElementSetController.fromSchema(data);
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((elementSet) => {
	            if (elementSet.uid === null) {
	                throw new Error('could not find source');
	            }
	            return this.db.select('elements')
	                .where({ 'element_set': elementSet.uid })
	                .then((elements) => {
	                elementSet.elements = elements;
	                return elementSet;
	            });
	        });
	    }
	}
	exports.ElementSetController = ElementSetController;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	class GenericController {
	    constructor(db, table) {
	        this.db = db;
	        this.tableName = table;
	    }
	    getItemJson(obj, uid) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.loadItem(this.tableName, uid)
	            .then((data) => this.fromSchema(data));
	    }
	    getCollectionJson(obj, params = {}) {
	        return this.db.loadCollection(this.tableName, params)
	            .then((data) => data.map((datum) => this.fromSchema(datum)));
	    }
	    postItem(obj, data) {
	        return this.db.createItem(this.tableName, this.toSchema(data));
	    }
	    putItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.updateItem(this.tableName, this.toSchema(data));
	    }
	    patchItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.loadItem(this.tableName, uid)
	            .then((originalData) => {
	            return this.db.updateItem(this.tableName, this.toSchema(Object.assign(this.fromSchema(originalData), data)));
	        });
	    }
	    deleteItem(obj, uid) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.deleteItem(this.tableName, uid);
	    }
	}
	exports.GenericController = GenericController;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const Exceptions_1 = __webpack_require__(14);
	const lodash_1 = __webpack_require__(13);
	class EntityController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'entities');
	    }
	    static fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Entity.prototype), {
	            entityType: data.type,
	            uid: data.uid,
	            label: data.label,
	            parent: data.parent
	        });
	    }
	    static toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'entityType', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            type: data.entityType,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return EntityController.fromSchema(data);
	    }
	    toSchema(data) {
	        return EntityController.toSchema(data);
	    }
	    getCollectionJson(obj, params = {}) {
	        const _super = name => super[name];
	        return __awaiter(this, void 0, void 0, function* () {
	            if (params.type !== undefined) {
	                const ancestorTypes = yield this.db.getChildrenOf(lodash_1.isArray(params.type) ? params.type[0] : params.type, 'entity_types');
	                return this.db.select('entities')
	                    .whereIn('type', ancestorTypes)
	                    .then((rawEntities) => rawEntities.map((entity) => this.fromSchema(entity)));
	            }
	            else {
	                return _super("getCollectionJson").call(this, obj, params);
	            }
	        });
	    }
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const [entities, records] = yield Promise.all([
	                this.db.select(this.tableName).where('parent', '=', uid),
	                this.db.select('records').where('value_entity', '=', uid)
	            ]);
	            if (entities.length + records.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the entity is referenced in other sources',
	                    data: Promise.resolve({
	                        entity: entities,
	                        record: records
	                    })
	                });
	            }
	        });
	    }
	}
	exports.EntityController = EntityController;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const PredicateController_1 = __webpack_require__(37);
	const EntityController_1 = __webpack_require__(35);
	const Exceptions_1 = __webpack_require__(14);
	const lodash_1 = __webpack_require__(13);
	class EntityTypeController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'entity_types');
	    }
	    toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.EntityType.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((result) => {
	            return Promise.all([
	                this.db.getAncestorsOf(uid, 'entity_types')
	                    .then((ancestors) => {
	                    return this.db.select('entity_types').whereIn('uid', ancestors)
	                        .then((results) => results.map((result) => this.fromSchema(result)));
	                }),
	                this.db.select('entity_types', ['uid']).where({ parent: uid })
	            ])
	                .then(([parents, children]) => {
	                result.parents = parents;
	                result.children = children.map((child) => child.uid);
	                return result;
	            });
	        });
	    }
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const [entityTypes, entities, predicates] = yield Promise.all([
	                this.db.select(this.tableName).where('parent', '=', uid),
	                this.db.select('entities').where('type', '=', uid),
	                this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
	            ]);
	            if (entities.length + entityTypes.length + predicates.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the entity is referenced in other sources',
	                    data: Promise.resolve({
	                        entityType: entityTypes.map((entityType) => EntityController_1.EntityController.fromSchema(entityType)),
	                        entity: entities.map((entity) => EntityController_1.EntityController.fromSchema(entity)),
	                        predicate: predicates.map((predicate) => PredicateController_1.PredicateController.fromSchema(predicate))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.EntityTypeController = EntityTypeController;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const Exceptions_1 = __webpack_require__(14);
	const RecordController_1 = __webpack_require__(38);
	const lodash_1 = __webpack_require__(13);
	class PredicateController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'predicates');
	    }
	    static toSchema(data) {
	        const out = Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'range', 'rangeIsReference', 'sameAs', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            range_type: data.rangeIsReference ? 'entity' : data.range,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	        if (data.rangeIsReference) {
	            out['range_ref'] = data.range;
	        }
	        else {
	            out['range_ref'] = null;
	        }
	        return out;
	    }
	    static fromSchema(data) {
	        if (data.range_type === 'entity') {
	            data.range = data.range_ref;
	            data.rangeIsReference = true;
	        }
	        else {
	            data.range = data.range_type;
	            data.rangeIsReference = false;
	        }
	        return Object.assign(Object.create(falcon_core_1.Predicate.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    toSchema(data) {
	        return PredicateController.toSchema(data);
	    }
	    fromSchema(data) {
	        return PredicateController.fromSchema(data);
	    }
	    getCollectionJson(obj, params = {}) {
	        if (params.domain !== undefined) {
	            //TODO: this check should be unecessery
	            return this.db.getAncestorsOf(lodash_1.isArray(params.domain) ? params.domain[0] : params.domain, 'entity_types')
	                .then((ancestors) => {
	                return this.db.select('predicates').whereIn('domain', ancestors.concat([params.domain[0]]))
	                    .then((results) => results.map((result) => this.fromSchema(result)));
	            });
	        }
	        else {
	            return super.getCollectionJson(obj, params);
	        }
	    }
	    putItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.updateItem(this.tableName, falcon_core_1.Serializer.toJson(data));
	    }
	    patchItem(obj, uid, data) {
	        if (data.domain !== undefined) {
	            return this.db.select('records', ['entities.type as entityType'])
	                .distinct()
	                .where({ predicate: uid })
	                .innerJoin('entities', 'records.entity', 'entities.uid')
	                .then((records) => {
	                if (records.length > 0) {
	                    return this.db.getChildrenOf(data.domain, 'entity_types')
	                        .then((res) => {
	                        records.map((e) => e.entityType)
	                            .forEach((e) => {
	                            if (res.indexOf(e) === -1) {
	                                throw new Exceptions_1.OperationNotPermittedException({
	                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
	                                    data: Promise.resolve({})
	                                });
	                            }
	                        });
	                    }).then(() => super.patchItem(obj, uid, data));
	                }
	                return super.patchItem(obj, uid, data);
	            });
	        }
	        //TODO: fix range enforcement
	        if (data.range !== undefined) {
	            return this.db.select('records')
	                .where({ predicate: uid })
	                .then((records) => {
	                if (records.length > 0) {
	                    if (data.rangeIsReference === false) {
	                        throw new Exceptions_1.OperationNotPermittedException({
	                            message: 'The operation could not be completed as it would invalidate predicate relationships',
	                            data: Promise.resolve({})
	                        });
	                    }
	                    return this.db.getChildrenOf(data.range, 'entity_types')
	                        .then((res) => {
	                        records.map((e) => e.value_entity)
	                            .forEach((e) => {
	                            if (res.indexOf(e) === -1) {
	                                throw new Exceptions_1.OperationNotPermittedException({
	                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
	                                    data: Promise.resolve({})
	                                });
	                            }
	                        });
	                    }).then(() => super.patchItem(obj, uid, data));
	                }
	                return super.patchItem(obj, uid, data);
	            });
	        }
	        return super.patchItem(obj, uid, data);
	    }
	    deleteItem(obj, uid) {
	        // check if this entity is the parent of another entity or if it has any relationships
	        // pointing towards it.
	        return Promise.all([
	            this.db.loadCollection('records', { predicate: uid })
	        ]).then(([records]) => {
	            if (records.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the predicate is used by other records',
	                    data: Promise.resolve({
	                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.PredicateController = PredicateController;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const Exceptions_1 = __webpack_require__(14);
	const lodash_1 = __webpack_require__(13);
	class RecordController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'records');
	    }
	    static toSchema(data) {
	        const schemaOutput = lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'value', 'valueType', 'creationTimestamp', 'label', 'lastmodifiedTimestamp');
	        schemaOutput.value_type = data.valueType;
	        if (data.valueType !== undefined && data.valueType !== 'source') {
	            schemaOutput['value_' + data.valueType] = data.value;
	        }
	        return Object.assign({}, schemaOutput, {
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    static fromSchema(data) {
	        data.valueType = data.value_type;
	        switch (data.value_type) {
	            case 'entity':
	                data.value = data.value_entity;
	                break;
	            case 'string':
	                data.value = data.value_string;
	                break;
	            case 'date':
	                data.value = data.value_date;
	                break;
	            case 'integer':
	                data.value = data.value_integer;
	                break;
	            case 'point':
	                data.value = data.value_point;
	                break;
	            case 'region':
	                data.value = data.value_region;
	                break;
	            case 'source':
	                data.value = data.source;
	                break;
	            default:
	                data.value = null;
	        }
	        return Object.assign(Object.create(falcon_core_1.Record.prototype), data);
	    }
	    toSchema(data) {
	        return RecordController.toSchema(data);
	    }
	    fromSchema(data) {
	        return RecordController.fromSchema(data);
	    }
	    postItem(obj, data) {
	        // predicate domain must equal value_type
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.postItem(obj, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	    putItem(obj, uid, data) {
	        //TODO: what happens if we only update the value - and do not send the valueType again?
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.putItem(obj, uid, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	    patchItem(obj, uid, data) {
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.patchItem(obj, uid, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	}
	exports.RecordController = RecordController;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const Exceptions_1 = __webpack_require__(14);
	const RecordController_1 = __webpack_require__(38);
	const lodash_1 = __webpack_require__(13);
	class SourceController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'sources');
	    }
	    toSchema(data) {
	        return Object.assign({}, lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'metaData', 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Source.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    // override the getItemJson and getCollectionJson functions to also get information about the
	    // metadata associated with the retrieved source
	    getMetadata(fields, sourceId) {
	        return this.db.query().raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
	                ancestor(uid) AS (
	                SELECT parent FROM parent_of WHERE uid=?
	                UNION ALL
	                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
	
	            SELECT *
	                FROM ancestor;
	        `, sourceId).then((parents) => {
	            parents = lodash_1.map(parents, 'uid');
	            parents.pop();
	            parents = [sourceId].concat(parents);
	            return Promise.all(parents.map((parent) => this.db.query().select(fields)
	                .from('source_elements')
	                .innerJoin('elements', function () { this.on('source_elements.element', '=', 'elements.uid'); })
	                .innerJoin('element_sets', function () { this.on('element_sets.uid', '=', 'elements.element_set'); })
	                .where({ 'source_elements.source': parent }))).then((results) => {
	                const a = lodash_1.groupBy(lodash_1.flatten(results), 'label');
	                return Object.keys(a).reduce((prev, cur) => {
	                    const meta = lodash_1.omit(a[cur][0], 'source', 'value');
	                    meta['values'] = a[cur]
	                        .map((val) => ({ source: val.source, value: val.value, uid: val.uid }))
	                        .sort((a, b) => parents.indexOf(a.source) - parents.indexOf(b.source));
	                    return Object.assign(prev, { [cur]: meta });
	                }, {});
	            });
	        });
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((source) => {
	            if (source.uid === null) {
	                throw new Error('could not find source');
	            }
	            return Promise.all([
	                this.getMetadata([
	                    'source_elements.source as source',
	                    'elements.label',
	                    'source_elements.value',
	                    'elements.description',
	                    'element_sets.label as element_set',
	                    'elements.comment',
	                    'elements.uri',
	                    'elements.uid as element_uid'
	                ], source.uid),
	                this.db.query().select('uid').from('sources').where({ parent: uid }),
	                this.db.query().raw(`
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
	                    ancestor(uid) AS (
	                    SELECT parent FROM parent_of WHERE uid=?
	                    UNION ALL
	                    SELECT parent FROM parent_of JOIN ancestor USING(uid) )
	
	                    SELECT uid
	                    FROM ancestor;
	                `, uid)
	            ])
	                .then(([sourceElements, children, parents]) => {
	                source.metaData = sourceElements;
	                source.children = children.map((child) => child.uid).filter((child) => child !== null);
	                source.parents = parents.map((parent) => parent.uid).filter((parent) => parent !== null);
	                return source;
	            });
	        });
	    }
	    getCollectionJson(obj, params = {}) {
	        return super.getCollectionJson(obj, params)
	            .then((sources) => {
	            return Promise.all(sources.map((source) => {
	                if (source.uid === null) {
	                    throw new Error('could not find source');
	                }
	                return this.getMetadata([
	                    'elements.label',
	                    'source_elements.value'
	                ], source.uid)
	                    .then((sourceElements) => {
	                    source.metaData = sourceElements;
	                    return source;
	                });
	            }));
	        });
	    }
	    //TODO should find every child source, not just the direct children
	    deleteItem(obj, uid) {
	        // check if this entity is the parent of another entity or if it has any relationships
	        // pointing towards it.
	        return Promise.all([
	            this.db.loadCollection('records', { source: uid }),
	            this.db.loadCollection('sources', { parent: uid })
	        ]).then(([records, sources]) => {
	            if (records.length + sources.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the source is used by other records',
	                    data: Promise.resolve({
	                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record)),
	                        source: sources.map((source) => this.fromSchema(source))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.SourceController = SourceController;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	class ElementController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'elements');
	    }
	    toSchema(data) {
	        return falcon_core_1.Serializer.toJson(data);
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Element.prototype), data);
	    }
	}
	exports.ElementController = ElementController;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(31);
	const GenericController_1 = __webpack_require__(34);
	const Exceptions_1 = __webpack_require__(14);
	const lodash_1 = __webpack_require__(13);
	class SourceElementController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'source_elements');
	    }
	    toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'creationTimestamp', 'lastmodifiedTimestamp', 'uid', 'label'), {
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp,
	            // TODO: check these exist
	            source: data.uid.values['source'],
	            element: data.uid.values['element']
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.SourceElement.prototype), Object.assign(data, {
	            uid: {
	                order: ['source', 'element'],
	                values: {
	                    source: data.source,
	                    element: data.element
	                }
	            }
	        }));
	    }
	    getItemJson(obj, uid) {
	        return this.db.query().select()
	            .from(this.tableName)
	            .where(uid.values)
	            .first()
	            .then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result)
	            .then((data) => this.fromSchema(data));
	    }
	    putItem(obj, uid, data) {
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .update(this.toSchema(data));
	    }
	    patchItem(obj, uid, data) {
	        const schemaData = this.toSchema(data);
	        const keys = Object.keys(schemaData);
	        const updateObject = {};
	        for (let i = 0; i < keys.length; i += 1) {
	            if (schemaData[keys[i]] !== undefined) {
	                updateObject[keys[i]] = schemaData[keys[i]];
	            }
	        }
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .update(updateObject)
	            .then(() => true)
	            .catch((err) => { throw new Error(err); });
	    }
	    deleteItem(obj, uid) {
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .del();
	    }
	}
	exports.SourceElementController = SourceElementController;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Authentication
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const passport = __webpack_require__(8);
	const passport_local_1 = __webpack_require__(43);
	const bcrypt_1 = __webpack_require__(44);
	exports.setupAuth = (db) => {
	    passport.serializeUser((user, done) => {
	        done(null, user.uid);
	    });
	    passport.deserializeUser((uid, done) => {
	        db.query()('users')
	            .select().where({ uid })
	            .then(([user]) => done(null, user));
	    });
	    passport.use(new passport_local_1.Strategy((username, password, done) => {
	        // retrieve user ...
	        return db.query()('users')
	            .select().where({ username })
	            .then(([user]) => bcrypt_1.compare(password, user.password, (err, res) => {
	            if (err) {
	                done(null, false);
	            }
	            else {
	                done(null, user);
	            }
	        }));
	    }));
	};
	exports.Auth = {
	    setupAuth: exports.setupAuth
	};


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = require("passport-local");

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = require("bcrypt");

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Database Snapshot
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Knex = __webpack_require__(12);
	const fs = __webpack_require__(15);
	const path = __webpack_require__(46);
	class SqliteSnapshot {
	    constructor(config) {
	        this.knex = Knex(config);
	    }
	    //TODO: use some kind of tempory file tracking package
	    getSnapshotStream() {
	        const filename = path.join(process.cwd(), 'data', 'test.sqlite');
	        // fs.unlinkSync(filename);
	        // const db = new sqlite.Database(filename);
	        const tempKnex = Knex({
	            client: 'sqlite3',
	            connection: { filename },
	            migrations: {
	                directory: path.join(process.cwd(), 'data', 'migrations')
	            },
	            seeds: {
	                directory: path.join(process.cwd(), 'data', 'seeds')
	            },
	            useNullAsDefault: true
	        });
	        return tempKnex.migrate.latest()
	            .then(() => tempKnex.seed.run())
	            .then(() => {
	            return new Promise((res) => {
	                tempKnex.destroy(() => {
	                    const stream = fs.createReadStream(filename);
	                    stream.on('close', () => {
	                        fs.unlinkSync(filename);
	                    });
	                    res(stream);
	                });
	            });
	        });
	    }
	}
	exports.SqliteSnapshot = SqliteSnapshot;


/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = require("dotenv");

/***/ }
/******/ ]);
//# sourceMappingURL=app.backend.dist.js.map