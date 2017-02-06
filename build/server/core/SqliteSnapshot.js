/**
 * @fileOverview Database Snapshot
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var Knex = require("knex");
var fs = require("fs");
var path = require("path");
var SqliteSnapshot = (function () {
    function SqliteSnapshot(config) {
        this.knex = Knex(config);
    }
    //TODO: use some kind of tempory file tracking package
    SqliteSnapshot.prototype.getSnapshotStream = function () {
        var filename = path.join(process.cwd(), 'data', 'test.sqlite');
        // fs.unlinkSync(filename);
        // const db = new sqlite.Database(filename);
        var tempKnex = Knex({
            client: 'sqlite3',
            connection: { filename: filename },
            migrations: {
                directory: path.join(process.cwd(), 'data', 'migrations')
            },
            seeds: {
                directory: path.join(process.cwd(), 'data', 'seeds')
            },
            useNullAsDefault: true
        });
        return tempKnex.migrate.latest()
            .then(function () { return tempKnex.seed.run(); })
            .then(function () {
            return new Promise(function (res) {
                tempKnex.destroy(function () {
                    var stream = fs.createReadStream(filename);
                    stream.on('close', function () {
                        fs.unlinkSync(filename);
                    });
                    res(stream);
                });
            });
        });
    };
    return SqliteSnapshot;
}());
exports.SqliteSnapshot = SqliteSnapshot;
//# sourceMappingURL=SqliteSnapshot.js.map