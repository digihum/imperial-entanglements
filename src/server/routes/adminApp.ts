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

import { Database } from '../core/Database';

import { wrapDatabase } from './api';

import * as path from 'path';

import * as _ from 'lodash';

export const adminApp = (skeleton: _.TemplateExecutor, db: Database ) : Koa => {

    const server = new Koa();
    const serverRenderContext = createServerRenderContext();
    const serverApiContext = wrapDatabase(db, false);

    server.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
        if (ctx.isAuthenticated()) {
            return await next();
        } else {
            ctx.body = readFileSync(path.join(process.cwd(), 'dist', 'server', 'login.html'), 'utf8');
        }
    });

    server.use(async (ctx: Koa.Context) => {
        ctx.body = skeleton({ body: renderToStaticMarkup(createElement(FalconApp, {
            router: ServerRouter,
            api: serverApiContext,
            routerSettings: {
                context: serverRenderContext,
                location: ctx.request.url
            },
            environment: 'website',
            connected: true
        }))});
    });

    return server;
};
