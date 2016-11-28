/**
 * @fileOverview Database Snapshot
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';
import * as sqlite from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export class SqliteSnapshot {

    private knex : Knex;

    constructor(config: Knex.Config) {
        this.knex = Knex(config);
    }

    //TODO: use some kind of tempory file tracking package

    public getSnapshotStream() : Promise<fs.ReadStream> {
        const filename = path.join(process.cwd(), 'data', 'test.sqlite');
       // fs.unlinkSync(filename);
       // const db = new sqlite.Database(filename);

        let tempKnex = Knex({
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
