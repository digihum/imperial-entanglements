/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
var Knex = require("knex");
var fs = require("fs");
var path = require("path");
var Database_1 = require("../data/Database");
var wrapDatabase_1 = require("../data/wrapDatabase");
var pathToTestDatabase = './data/test.sqlite';
before(function (done) {
    console.log('SETTING UP DATABASE');
    if (fs.existsSync(pathToTestDatabase)) {
        fs.unlinkSync(pathToTestDatabase);
    }
    var knexConfig = {
        client: 'sqlite3',
        connection: {
            filename: pathToTestDatabase
        },
        migrations: {
            directory: path.join(process.cwd(), 'data', 'migrations')
        },
        seeds: {
            directory: path.join(process.cwd(), 'data', 'seeds')
        },
        useNullAsDefault: true
    };
    exports.knex = Knex(knexConfig);
    exports.api = wrapDatabase_1.wrapDatabase(new Database_1.Database(knexConfig), true);
    exports.knex.migrate.latest()
        .then(function () { return exports.knex.seed.run(); })
        .then(function () { return done(); });
});
//# sourceMappingURL=testHelper.js.map