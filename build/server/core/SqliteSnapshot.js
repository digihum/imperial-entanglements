/**
 * @fileOverview Database Snapshot
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const Knex = require("knex");
const fs = require("fs");
const path = require("path");
class SqliteSnapshot {
    constructor(config) {
        this.knex = Knex(config);
    }
    //TODO: use some kind of tempory file tracking package
    getSnapshotStream() {
        const filename = path.join(process.cwd(), 'data', 'test.sqlite');
        // fs.unlinkSync(filename);
        // const db = new sqlite.Database(filename);
        const tempKnex = Knex({
            client: 'sqlite3',
            connection: { filename },
            migrations: {
                directory: path.join(process.cwd(), 'data', 'migrations')
            },
            seeds: {
                directory: path.join(process.cwd(), 'data', 'seeds')
            },
            useNullAsDefault: true
        });
        return tempKnex.migrate.latest()
            .then(() => tempKnex.seed.run())
            .then(() => {
            return new Promise((res) => {
                tempKnex.destroy(() => {
                    const stream = fs.createReadStream(filename);
                    stream.on('close', () => {
                        fs.unlinkSync(filename);
                    });
                    res(stream);
                });
            });
        });
    }
}
exports.SqliteSnapshot = SqliteSnapshot;
//# sourceMappingURL=SqliteSnapshot.js.map