/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

// Vendor
import * as Koa from 'koa';

import * as moment from 'moment';

import { SqliteSnapshot } from '../core/SqliteSnapshot';

export const snapshot = (snapshot: SqliteSnapshot) : Koa => {

    const server = new Koa();

    server.use(function*() {
        this.set('Content-disposition', 'attachment; filename=' + 'snapshot_' + moment().toISOString() +  '.sqlite');
        this.set('Content-type', 'application/x-sqlite3');
        yield snapshot.getSnapshotStream()
        .then((snapshotStream) => {
            this.body = snapshotStream;
        });
    });

    return server;
};
