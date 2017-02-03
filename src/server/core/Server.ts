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

    // Sessions
    app.keys = ['secret'];
    app.use(koaConvert(koaSession(app)));

    app.use(koaPassport.initialize());
    app.use(koaPassport.session());

    app.use(koaStatic(path.join(process.cwd(), 'dist', 'static')));

    const db = new Database(databaseConfig);
    const snapshotter = new SqliteSnapshot(databaseConfig);

    setupAuth(db);

    app.use(koaMount('/api/v1', api(db)));

    app.use(koaMount('/', user(db)));

    app.use(koaMount('/snapshot', snapshot(snapshotter)));
    app.use(koaMount('/stats', stats(db)));
    app.use(koaMount('/', adminApp(db)));

    app.use(async (ctx: Koa.Context) => {
      ctx.body = '404';
    });

    return app;
};
