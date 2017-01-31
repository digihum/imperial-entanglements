/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

// Vendor
import * as Koa from 'koa';
import * as __ from 'koa-route';
import * as koaPassport from 'koa-passport';

import { Database } from '../../backend/data/Database';

export const user = (db: Database) : Koa => {

    const server = new Koa();

    server.use(__.post('/login', koaPassport.authenticate(process.env.AUTH_TYPE, {
        successRedirect: '/admin',
        failureRedirect: '/login'
    })));

    server.use(__.get('/logout', async (ctx: Koa.Context) => {
        ctx.logout();
        ctx.redirect('/admin');
    }));

   server.use(__.get('/currentuser', async (ctx: Koa.Context) => {
        ctx.body = {
            username: ctx.req.user.name
        };
   }));

   server.use(__.get('/tabset', async (ctx: Koa.Context) => {
     if (ctx.isAuthenticated()) {
       ctx.body = await db.query()('tabset').where({ owner: ctx.req.user.uid })
       .then((res) => res.map((tabset) => ({...tabset, tabs: JSON.parse(tabset.tabs) })));
     }
   }));

   server.use(__.post('/tabset', async (ctx: Koa.Context) => {
     if (ctx.isAuthenticated()) {
     await db.query()('tabset')
      .insert({ owner: ctx.req.user.uid, name: ctx.request.body.name, tabs: JSON.stringify(ctx.request.body.tabs) })
      .then(() => {});
       ctx.body = 1;
     }
   }));

   server.use(__.delete('/tabset/:id', async (ctx: Koa.Context, id: number) => {
     if (ctx.isAuthenticated()) {
     await db.query()('tabset')
      .where({ uid: id, owner: ctx.req.user.uid })
      .del()
      .then(() => {});
       ctx.body = 1;
     }
   }));

    // create user
    // delete user
    // reset user password
    // change user permission

    return server;
};
