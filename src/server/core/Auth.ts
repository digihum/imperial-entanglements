/**
 * @fileOverview Authentication
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as  passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as LdapStrategy } from 'passport-ldapauth';

import { hash, compare } from 'bcrypt';

import * as winston from 'winston';

import { Database } from '../../backend/data/Database';

export const setupAuth = (db: Database) => {
    passport.serializeUser((user, done) => {
        done(null, user.uid);
    });

    passport.deserializeUser((uid, done) => {
        db.query()('users')
        .select().where({uid})
        .then(([user]) => done(null, user));
    });

    if (process.env.AUTH_TYPE === 'local') {
      passport.use(new LocalStrategy((username, password, done) => {
        // retrieve user ...
        return db.query()('users')
        .select().where({username})
        .then(([user]) => compare(password, user.password, (err, res) => {
            if (err) {
                done(null, false);
            } else {
              winston.info(username, ' logged in');
              done(null, user);
            }
      }))}));
    }

    if (process.env.AUTH_TYPE === 'ldapauth') {
      passport.use(new LdapStrategy({
        server: {
          url: `${process.env.AUTH_LDAP_HOST}:{process.env.AUTH_LDAP_PORT}`,
          bindDn: process.env.AUTH_LDAP_USERNAME,
          bindCredentials: process.env.AUTH_LDAP_PASSWORD,
          searchBase: process.env.AUTH_LDAP_BASEDN,
          searchFilter: process.env.AUTH_LDAP_ACCOUNTFILTERFORMAT
        }
      }, (user, done) => {
        return db.query()('users')
        .select().where({username: user.name})
        .then(([user]) => {
            if (user) {
              winston.info(user.name, ' logged in');
              done(null, user);
            } else {
              done(null, false);
            }
      });
    }
));
    }

};

export const Auth = {
    setupAuth
};
