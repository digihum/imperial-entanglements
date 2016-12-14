/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Koa from 'koa';

import { readFileSync } from 'fs';

import { FalconApp } from '../../common/FalconApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { ServerRouter, createServerRenderContext } from 'react-router';

import { ServerApiService } from '../core/ServerApiService';

import * as path from 'path';

import * as _ from 'lodash';

export const adminApp = (skeleton: _.TemplateExecutor, serverApiContext: ServerApiService ) : Koa => {

    const server = new Koa();
    const serverRenderContext = createServerRenderContext();

    server.use(function* (next: Koa.Context) {
        if (this.isAuthenticated()) {
            yield next;
        } else {
            this.body = readFileSync(path.join(process.cwd(), 'dist', 'server', 'login.html'), 'utf8');
        }
    });

    server.use(function* (next: Koa.Context) {
        this.body = skeleton({ body: renderToStaticMarkup(createElement(FalconApp, {
            router: ServerRouter,
            api: serverApiContext,
            routerSettings: {
                context: serverRenderContext,
                location: this.request.url
            },
            environment: 'website',
            connected: true
        }))});
    });

    return server;
};
