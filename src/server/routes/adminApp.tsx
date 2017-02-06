/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as Koa from 'koa';
import * as React from 'react';

import { readFileSync } from 'fs';

import { FalconApp } from '../../common/FalconApp';

import { renderToStaticMarkup } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';

import { Database } from '../../backend/data/Database';

import { wrapDatabase } from '../../backend/data/wrapDatabase';

import { Index } from '../../common/Index';
import { Login } from '../../common/Login';

export const adminApp = (db: Database ) : Koa => {

    const server = new Koa();
    const serverRenderContext = createServerRenderContext();
    const serverApiContext = wrapDatabase(db, false);

    server.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
       if (ctx.isAuthenticated()) {
            return await next();
        } else {
           ctx.body = renderToStaticMarkup(
            <Login>
            </Login>);
       }
    });

    server.use(async (ctx: Koa.Context) => {

      ctx.body = renderToStaticMarkup(
      <Index>
        <FalconApp
          router={ServerRouter}
          api={serverApiContext}
          routerSettings={{
              context: serverRenderContext,
              location: ctx.request.url
          }}
          environment= 'website'
          connected={true}
        />
      </Index>);
    });

    return server;
};
