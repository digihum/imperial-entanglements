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

    public getSnapshotStream() : Promise<fs.ReadStream> {
        const filename = __dirname + '/test.sqlite';
        const db = new sqlite.Database(filename);

        const tempKnex = Knex({
            client: 'sqlite3',
            connection: { filename },
            migrations: {
                directory: './data/migrations'
            }
        });

        // db.serialize(() => {
        //     db.run("CREATE TABLE lorem (info TEXT)");
            
        //     var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        //     for (var i = 0; i < 10; i++) {
        //         stmt.run("Ipsum " + i);
        //     }
        //     stmt.finalize();

        // });

        return tempKnex.migrate.latest()
        .then(() => {
            return new Promise((res) => {
                db.close(() => {
                    const stream = fs.createReadStream(filename);
                    stream.on('close', () => fs.unlinkSync(filename));
                    res(stream);
                });
            });
        });
    }
}