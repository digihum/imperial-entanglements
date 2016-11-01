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

import { Config as KnexConfig } from 'knex';
import { Database } from './Database';

import { FalconApp } from '../../common/FalconApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api, wrapDatabase } from '../routes/api';

import { ServerRouter, createServerRenderContext } from 'react-router';

import { setupAuth } from './Auth';

export class Server {

    private app: Koa;
    private skeleton: _.TemplateExecutor;
    private apiRoute: string;
    private adminRoute: string;
    private adminEditRoute: string;

    // TODO: type this properly
    private routingContext: any;

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

        this.app.use(koaStatic('build/static'));

        this.skeleton = template(readFileSync('./build/common/index.html', 'utf8'));

        this.apiRoute = 'api/v1';
        this.adminRoute = 'admin';
        this.adminEditRoute = 'edit';

        this.routingContext = createServerRenderContext();

        const db = new Database(databaseConfig);

        setupAuth(db);

        let router = new KoaRouter();
        router.use(koaJSON());
        router.use(koaBodyParser({
            enableTypes: ['json', 'form', 'text']
        }));

        const serverApiContext = wrapDatabase(db);
        router = api(router, serverApiContext);

        this.app.use(router.middleware());

        const authRouter = new KoaRouter();
        authRouter.post(`/${this.adminRoute}/login`, koaPassport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login'
        }));

        authRouter.get(`/${this.adminRoute}/logout`, function*() {
            this.logout();
            this.redirect('/admin');
        });

        authRouter.get(`/${this.adminRoute}/currentuser`, function*() {
            this.body = {
                username: this.req.user.name
            };
        });

        this.app.use(authRouter.middleware());

        const adminApp = new Koa();

        const self = this;

        adminApp.use(function* (next: Koa.Context) {
            if (this.isAuthenticated()) {
                yield next;
            } else {
                this.body = readFileSync('./build/common/login.html', 'utf8');
            }
        });

        adminApp.use(function* (next: Koa.Context) {
            this.body = self.skeleton({ body: renderToStaticMarkup(createElement(FalconApp, {
                router: ServerRouter,
                api: serverApiContext,
                routerSettings: {
                    context: self.routingContext,
                    location: this.request.url
                }
            }))});
        });

        this.app.use(koaMount('/admin', adminApp));

        const frontendApp = new Koa();

        frontendApp.use(function* (next: Koa.Context) {
            this.body = 'Frontend under construction';
        });

         this.app.use(koaMount('/', frontendApp));

        this.app.use(function* (next: Koa.Context) { this.body = '404'; });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
