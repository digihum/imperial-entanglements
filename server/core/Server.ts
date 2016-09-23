/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as Koa from 'koa';
import * as koaStatic from 'koa-static';
import * as koaRouter from 'koa-router';
import * as koaJSON from 'koa-json';

import { home } from '../../common/views/home';
import { renderToStaticMarkup } from 'react-dom/server';
import { template } from 'lodash';
import { readFileSync } from 'fs';

import { api } from '../routes/api';

export class Server {

    private app: Koa;
    private skeleton: _.TemplateExecutor;
    private apiRoute: string;
    private adminRoute: string;
    private adminEditRoute: string;

    public init() : void {

        this.app = new Koa();
        this.app.use(koaStatic('build/static'));

        this.skeleton = template(readFileSync('./common/index.html', 'utf8'));

        this.apiRoute = 'api/v1';
        this.adminRoute = 'admin';
        this.adminEditRoute = 'edit';

        const router = new koaRouter();

        router.use(koaJSON());

        for (var [route, controller] of api) {
            router.get(`/${this.apiRoute}/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                try {
                    this.body = await controller.getItemJson(this.params.id);
                    console.log(this.body);
                } catch(err) {
                    this.status = 404;
                    this.body = err;
                }
            });

            router.get(`/${this.adminRoute}/${this.adminEditRoute}/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                try {
                    this.body = self.skeleton({ body: await controller.getItemEditPage(this.params.id) });
                } catch(err) {
                    this.status = 404;
                    this.body = err;
                }
            });

            router.get(`/${route}/:id`, function* (next : koaRouter.IRouterContext) {
                try {
                    this.body = await controller.getItemPage(this.params.id);
                } catch(err) {
                    this.status = 404;
                    this.body = err;
                }
            });
        }

        this.app.use(router.middleware());

        const self = this;
        this.app.use(function* (){
            this.body = self.skeleton({ body: renderToStaticMarkup(home({})) + '<script src="home.dist.js"></script>'});
        });
    }

    public listen() : void {
        this.app.listen(8080);
    }
}
