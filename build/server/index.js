/**
 * @fileOverview Entry point for server application
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const Server_1 = require("./core/Server");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const databaseConnection = {
    useNullAsDefault: true,
    connection: {}
};
if (process.env.DB_TYPE === 'sqlite') {
    databaseConnection.client = 'sqlite3';
    if (databaseConnection.connection !== undefined) {
        databaseConnection.connection.filename = './data/mydb.sqlite';
    }
    databaseConnection.pool = {
        afterCreate: (conn, cb) => {
            conn.run('PRAGMA foreign_keys = ON', cb);
        }
    };
}
if (process.env.DB_TYPE === 'postgres') {
    databaseConnection.client = 'pg';
    databaseConnection.connection.host = process.env.DB_HOST;
    databaseConnection.connection.user = process.env.DB_USER;
    databaseConnection.connection.password = process.env.DB_PASSWORD;
    databaseConnection.connection.database = process.env.DB_DATABASE;
}
const server = Server_1.Server(databaseConnection);
server.listen(8080);
//# sourceMappingURL=index.js.map