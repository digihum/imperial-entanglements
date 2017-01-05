/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as __ from 'koa-route';
import * as koaPassport from 'koa-passport';

export const auth = () : Koa => {

    const server = new Koa();

    server.use(__.post('/login', koaPassport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login'
    })));

    const self = this;

    server.use(__.get('/logout', async (ctx: Koa.Context) => {
        ctx.logout();
        ctx.redirect('/admin');
    }));

   server.use(__.get('/currentuser', async (ctx: Koa.Context) => {
        ctx.body = {
            username: ctx.req.user.name
        };
   }));

    // create user
    // delete user
    // reset user password
    // change user permission

    return server;
};
