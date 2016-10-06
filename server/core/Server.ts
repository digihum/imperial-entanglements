/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as KoaRouter from 'koa-router';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaQs from 'koa-qs';
import * as koaLogger from 'koa-logger';

import { Config as KnexConfig } from 'knex';
import { Database } from './Database';

import { FalconApp } from '../../common/FalconApp';
import { renderToStaticMarkup } from 'react-dom/server';
import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api, wrapDatabase } from '../routes/api';

import { ServerRouter, createServerRenderContext } from 'react-router';

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
        koaQs(this.app, 'first');
        this.app.use(koaStatic('build/static'));

        this.skeleton = template(readFileSync('./build/common/index.html', 'utf8'));

        this.apiRoute = 'api/v1';
        this.adminRoute = 'admin';
        this.adminEditRoute = 'edit';

        this.routingContext = createServerRenderContext();

        const db = new Database(databaseConfig);

        let router = new KoaRouter();
        router.use(koaJSON());
        router.use(koaBodyParser());

        const serverApiContext = wrapDatabase(db);
        router = api(router, serverApiContext);

        this.app.use(router.middleware());

        const self = this;
        this.app.use(function* (next: Koa.Context) {
            this.body = self.skeleton({ body: renderToStaticMarkup(FalconApp({
                router: ServerRouter,
                api: serverApiContext,
                routerSettings: {
                    context: self.routingContext,
                    location: this.request.url
                }
            }))});
        });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
