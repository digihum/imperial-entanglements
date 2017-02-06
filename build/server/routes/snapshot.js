/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
// Vendor
var Koa = require("koa");
var moment = require("moment");
exports.snapshot = function (snapshot) {
    var server = new Koa();
    server.use(function* () {
        var _this = this;
        this.set('Content-disposition', 'attachment; filename=' + 'snapshot_' + moment().toISOString() + '.sqlite');
        this.set('Content-type', 'application/x-sqlite3');
        yield snapshot.getSnapshotStream()
            .then(function (snapshotStream) {
            _this.body = snapshotStream;
        });
    });
    return server;
};
//# sourceMappingURL=snapshot.js.map