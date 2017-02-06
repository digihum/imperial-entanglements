/**
 * @fileOverview Authentication
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const passport = require("koa-passport");
const passport_local_1 = require("passport-local");
const passport_ldapauth_1 = require("passport-ldapauth");
const bcrypt_1 = require("bcrypt");
const winston = require("winston");
exports.setupAuth = (db) => {
    passport.serializeUser((user, done) => {
        done(null, user.uid);
    });
    passport.deserializeUser((uid, done) => {
        db.query()('users')
            .select().where({ uid })
            .then(([user]) => done(null, user));
    });
    if (process.env.AUTH_TYPE === 'local') {
        passport.use(new passport_local_1.Strategy((username, password, done) => {
            // retrieve user ...
            return db.query()('users')
                .select().where({ username })
                .then(([user]) => bcrypt_1.compare(password, user.password, (err, res) => {
                if (err) {
                    done(null, false);
                }
                else {
                    winston.info(username, ' logged in');
                    done(null, user);
                }
            }));
        }));
    }
    if (process.env.AUTH_TYPE === 'ldapauth') {
        passport.use(new passport_ldapauth_1.Strategy({
            server: {
                url: `${process.env.AUTH_LDAP_HOST}:{process.env.AUTH_LDAP_PORT}`,
                bindDn: process.env.AUTH_LDAP_USERNAME,
                bindCredentials: process.env.AUTH_LDAP_PASSWORD,
                searchBase: process.env.AUTH_LDAP_BASEDN,
                searchFilter: process.env.AUTH_LDAP_ACCOUNTFILTERFORMAT
            }
        }, (user, done) => {
            return db.query()('users')
                .select().where({ username: user.name })
                .then(([user]) => {
                if (user) {
                    winston.info(user.name, ' logged in');
                    done(null, user);
                }
                else {
                    done(null, false);
                }
            });
        }));
    }
};
exports.Auth = {
    setupAuth: exports.setupAuth
};
//# sourceMappingURL=Auth.js.map