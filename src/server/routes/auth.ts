/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

// Vendor
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as koaPassport from 'koa-passport';

export const auth = () : Koa => {

    const server = new Koa();

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

    // create user
    // delete user
    // reset user password
    // change user permission


    server.use(authRouter.middleware());


    return server;
};
