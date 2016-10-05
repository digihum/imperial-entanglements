/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as koaRouter from 'koa-router';
import * as koaJSON from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaQs from 'koa-qs';

import { Config as KnexConfig } from 'knex';

import { FalconApp } from '../../common/FalconApp';
import { renderToStaticMarkup } from 'react-dom/server';
import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api } from '../routes/api';

import { ServerRouter, createServerRenderContext } from 'react-router';
import { ServerApiService } from './ServerApiService';

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
        koaQs(this.app, 'first');
        this.app.use(koaStatic('build/static'));

        this.skeleton = template(readFileSync('./build/common/index.html', 'utf8'));

        this.apiRoute = 'api/v1';
        this.adminRoute = 'admin';
        this.adminEditRoute = 'edit';

        this.routingContext = createServerRenderContext();

        const router = new koaRouter();

        router.use(koaJSON());
        router.use(koaBodyParser());

        const routes = api(databaseConfig);

        for (const [route, controller] of routes) {

            router.use(function* (next: Koa.Context){
                try {
                    yield next;
                } catch (err) {
                    switch (err.constructor.name) {
                        case 'KeyNotFoundException':
                            this.status = 404;
                            break;
                        default:
                            this.status = 500;
                    }
                    this.body = err.message;
                }
            });

            router.get(`/${this.apiRoute}/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                yield controller.getItemJson(this.params.id)
                .then((data) => this.body = data);
            });

            router.get(`/${this.apiRoute}/${route}`, function* (next : koaRouter.IRouterContext) {
                 yield controller.getCollectionJson(this.query)
                .then((data) => this.body = data);
            });

            router.post(`/${this.apiRoute}/${route}`, function* (next : koaRouter.IRouterContext) {
                yield controller.postItem(this.request.body)
                .then((data) => this.body = data);
            });

            router.put(`/${this.apiRoute}/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                yield controller.putItem(this.params.id, this.request.body)
                .then((data) => this.body = data);
            });

            router.del(`/${this.apiRoute}/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                yield controller.deleteItem(this.request.body)
                .then((data) => this.body = data);
            });
        }

        this.app.use(router.middleware());

        const self = this;
        this.app.use(function* (next: Koa.Context) {
            this.body = self.skeleton({ body: renderToStaticMarkup(FalconApp({
                router: ServerRouter,
                api: new ServerApiService(),
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
