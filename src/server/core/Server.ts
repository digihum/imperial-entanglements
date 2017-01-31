/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaLogger from 'koa-logger';
import * as koaSession from 'koa-session';
// import * as koaConditionalGet from 'koa-conditional-get';
// import * as koaEtags from 'koa-etag';
import * as koaPassport from 'koa-passport';
import * as koaMount from 'koa-mount';
import * as koaConvert from 'koa-convert';
import * as  enforceHttps from 'koa-sslify';

import { Config as KnexConfig } from 'knex';
import { Database } from '../../backend/data/Database';

import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api } from '../routes/api';
import { adminApp } from '../routes/adminApp';
import { user  } from '../routes/user';
import { snapshot  } from '../routes/snapshot';
import { stats  } from '../routes/stats';

import { setupAuth } from './Auth';

import { SqliteSnapshot } from './SqliteSnapshot';

import * as path from 'path';

import * as _ from 'lodash';

export const Server = (databaseConfig: KnexConfig) : Koa => {

    const app = new Koa();

    app.use(koaConvert(koaLogger()));
    //koaQs(app, 'strict');

    app.use(koaConvert(koaBodyParser()));

    if (process.env.FORCE_HTTPS === 'yes') {
      app.use(enforceHttps({
        trustProtoHeader: true,
        hostname: process.env.HOST_NAME
      }));
    }

    // Sessions
    app.keys = ['secret'];
    app.use(koaConvert(koaSession(app)));

    app.use(koaPassport.initialize());
    app.use(koaPassport.session());

    app.use(koaStatic(path.join(process.cwd(), 'dist', 'server', 'static')));

    const skeleton = template(readFileSync(path.join(process.cwd(), 'dist', 'server', 'index.html'), 'utf8'));

    const db = new Database(databaseConfig);
    const snapshotter = new SqliteSnapshot(databaseConfig);

    setupAuth(db);

    app.use(koaMount('/api/v1', api(db)));

    const admin = new Koa();

    admin.use(koaMount('/', user(db)));

    admin.use(koaMount('/snapshot', snapshot(snapshotter)));
    admin.use(koaMount('/stats', stats(db)));
    admin.use(koaMount('/', adminApp(skeleton, db)));

    app.use(koaMount('/admin', admin));

    app.use(async (ctx: Koa.Context) => {
      ctx.body = '404';
    });

    return app;
}
