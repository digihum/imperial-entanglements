/**
 * @fileOverview Authentication
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as  passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { hash, compare } from 'bcrypt';

import { Database } from './Database';

export const setupAuth = (db: Database) => {
    passport.serializeUser((user, done) => {
        done(null, user.uid);
    });

    passport.deserializeUser((uid, done) => {
        db.query()('users')
        .select().where({uid})
        .then(([user]) => done(null, user));
    });

    passport.use(new LocalStrategy((username, password, done) => {
        // retrieve user ...
        return db.query()('users')
        .select().where({username})
        .then(([user]) => compare(password, user.password, (err, res) => {
            if (err) {
                done(null, false);
            } else {
                done(null, user);
            }
      }))}));
};

export const Auth = {
    setupAuth
};
