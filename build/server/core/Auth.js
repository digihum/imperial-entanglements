/**
 * @fileOverview Authentication
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var passport = require("koa-passport");
var passport_local_1 = require("passport-local");
var passport_ldapauth_1 = require("passport-ldapauth");
var bcrypt_1 = require("bcrypt");
var winston = require("winston");
exports.setupAuth = function (db) {
    passport.serializeUser(function (user, done) {
        done(null, user.uid);
    });
    passport.deserializeUser(function (uid, done) {
        db.query()('users')
            .select().where({ uid: uid })
            .then(function (_a) {
            var user = _a[0];
            return done(null, user);
        });
    });
    if (process.env.AUTH_TYPE === 'local') {
        passport.use(new passport_local_1.Strategy(function (username, password, done) {
            // retrieve user ...
            return db.query()('users')
                .select().where({ username: username })
                .then(function (_a) {
                var user = _a[0];
                return bcrypt_1.compare(password, user.password, function (err, res) {
                    if (err) {
                        done(null, false);
                    }
                    else {
                        winston.info(username, ' logged in');
                        done(null, user);
                    }
                });
            });
        }));
    }
    if (process.env.AUTH_TYPE === 'ldapauth') {
        passport.use(new passport_ldapauth_1.Strategy({
            server: {
                url: process.env.AUTH_LDAP_HOST + ":{process.env.AUTH_LDAP_PORT}",
                bindDn: process.env.AUTH_LDAP_USERNAME,
                bindCredentials: process.env.AUTH_LDAP_PASSWORD,
                searchBase: process.env.AUTH_LDAP_BASEDN,
                searchFilter: process.env.AUTH_LDAP_ACCOUNTFILTERFORMAT
            }
        }, function (user, done) {
            return db.query()('users')
                .select().where({ username: user.name })
                .then(function (_a) {
                var user = _a[0];
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