/**
 * @fileOverview Database Snapshot
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';
import * as sqlite from 'sqlite3';
import * as fs from 'fs';

export class SqliteSnapshot {

    private knex : Knex;

    constructor(config: Knex.Config) {
        this.knex = Knex(config);
    }

    //TODO: use some kind of tempory file tracking package

    public getSnapshotStream() : Promise<fs.ReadStream> {
        const filename = __dirname + '/test.sqlite';
        fs.unlinkSync(filename);
        const db = new sqlite.Database(filename);

        let tempKnex = Knex({
            client: 'sqlite3',
            connection: { filename },
            migrations: {
                directory: './data/migrations'
            }
        });

        return tempKnex.migrate.latest()
        .then(() => {
            return new Promise((res) => {
                db.close(() => {
                    const stream = fs.createReadStream(filename);
                    res(stream);
                });
            });
        });
    }
}