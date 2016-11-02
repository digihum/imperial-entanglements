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
import * as koaPassport from 'koa-passport';
import * as koaMount from 'koa-mount';

import { SqliteSnapshot } from './SqliteSnapshot';

import { readFileSync } from 'fs';

import { FalconApp } from '../../common/FalconApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { ServerRouter, createServerRenderContext } from 'react-router';

import { ServerApiService } from './ServerApiService';

export const AdminApp = (snapshot: SqliteSnapshot, skeleton: _.TemplateExecutor, serverApiContext: ServerApiService ) => {

    const adminApp = new Koa();

    const authRouter = new KoaRouter();
    authRouter.post(`/login`, koaPassport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login'
    }));

    const self = this;

    authRouter.get(`/logout`, function*() {
        this.logout();
        this.redirect('/admin');
    });

    authRouter.get(`/currentuser`, function*() {
        this.body = {
            username: this.req.user.name
        };
    });

    authRouter.get(`/snapshot`, function*() {
        this.set('Content-disposition', 'attachment; filename=' + 'snapshot_' + moment().toISOString() +  '.sqlite');
        this.set('Content-type', 'application/x-sqlite3');
        yield snapshot.getSnapshotStream()
        .then((snapshotStream) => {
            this.body = snapshotStream;
        });
    });


    adminApp.use(authRouter.middleware());
 

    adminApp.use(function* (next: Koa.Context) {
        if (this.isAuthenticated()) {
            yield next;
        } else {
            this.body = readFileSync('./build/common/login.html', 'utf8');
        }
    });

    adminApp.use(function* (next: Koa.Context) {
        this.body = skeleton({ body: renderToStaticMarkup(createElement(FalconApp, {
            router: ServerRouter,
            api: serverApiContext,
            routerSettings: {
                context: self.routingContext,
                location: this.request.url
            }
        }))});
    });

    return adminApp;
};