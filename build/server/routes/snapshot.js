/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
// Vendor
const Koa = require("koa");
const moment = require("moment");
exports.snapshot = (snapshot) => {
    const server = new Koa();
    server.use(function* () {
        this.set('Content-disposition', 'attachment; filename=' + 'snapshot_' + moment().toISOString() + '.sqlite');
        this.set('Content-type', 'application/x-sqlite3');
        yield snapshot.getSnapshotStream()
            .then((snapshotStream) => {
            this.body = snapshotStream;
        });
    });
    return server;
};
//# sourceMappingURL=snapshot.js.map