/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as KoaRouter from 'koa-router';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaQs from 'koa-qs';
import * as koaLogger from 'koa-logger';
import * as koaSession from 'koa-session';
import * as koaConditionalGet from 'koa-conditional-get';
import * as koaEtags from 'koa-etag';
import * as koaPassport from 'koa-passport';
import * as koaMount from 'koa-mount';

import { Config as KnexConfig } from 'knex';
import { Database } from './Database';

import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api, wrapDatabase } from '../routes/api';
import { adminApp } from '../routes/adminApp';
import { auth  } from '../routes/auth';
import { snapshot  } from '../routes/snapshot';
import { stats  } from '../routes/stats';

import { setupAuth } from './Auth';

import { SqliteSnapshot } from './SqliteSnapshot';

import { server as frontendApp } from 'imperial-entanglements-frontend';

import * as path from 'path';

export class Server {

    private app: Koa;
    private skeleton: _.TemplateExecutor;
    private apiRoute: string;
    private adminRoute: string;
    private adminEditRoute: string;

    private snapshot: SqliteSnapshot;

    public init(databaseConfig: KnexConfig) : void {

        this.app = new Koa();
        this.app.use(koaLogger());
        koaQs(this.app, 'strict');

        this.app.use(koaBodyParser());

        // Sessions
        this.app.keys = ['secret'];
        this.app.use(koaSession(this.app));

        this.app.use(koaPassport.initialize());
        this.app.use(koaPassport.session());

        this.app.use(koaStatic(path.join(process.cwd(), 'dist', 'server', 'static')));

        this.skeleton = template(readFileSync(path.join(process.cwd(), 'dist', 'server', 'index.html'), 'utf8'));

        this.apiRoute = 'api/v1';
        this.adminRoute = 'admin';
        this.adminEditRoute = 'edit';

        const db = new Database(databaseConfig);
        this.snapshot = new SqliteSnapshot(databaseConfig);

        setupAuth(db);

        let router = new KoaRouter();
        router.use(koaJSON());
        router.use(koaBodyParser({
            enableTypes: ['json', 'form', 'text']
        }));

        const serverApiContext = wrapDatabase(db, false);
        router = api(router, serverApiContext);

        this.app.use(router.middleware());

        const admin = new Koa();
        admin.use(koaMount('/', auth()));
        admin.use(koaMount('/snapshot', snapshot(this.snapshot)));
        admin.use(koaMount('/stats', stats(db)));
        admin.use(koaMount('/', adminApp(this.skeleton, serverApiContext)));
        this.app.use(koaMount('/admin', admin));

        this.app.use(koaMount('/', frontendApp));

        this.app.use(function* (next: Koa.Context) { this.body = '404'; });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
