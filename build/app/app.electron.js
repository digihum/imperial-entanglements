/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const react_dom_1 = require("react-dom");
const react_1 = require("react");
const FalconApp_1 = require("../common/FalconApp");
const Database_1 = require("../backend/data/Database");
const wrapDatabase_1 = require("../backend/data/wrapDatabase");
const react_router_1 = require("react-router");
const electron = require("electron");
const databaseFile = electron.remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [
        { name: 'Database Files', extensions: ['sqlite'] }
    ] });
if (databaseFile !== undefined) {
    electron.remote.getCurrentWindow().setTitle(`Imperial Entanglements (${databaseFile[0]})`);
    const db = new Database_1.Database({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
            filename: databaseFile[0]
        },
        pool: {
            afterCreate: (conn, cb) => {
                conn.run('PRAGMA foreign_keys = ON', cb);
            }
        }
    });
    document.addEventListener('DOMContentLoaded', (event) => {
        react_dom_1.render(react_1.createElement(FalconApp_1.FalconApp, {
            api: wrapDatabase_1.wrapDatabase(db, true),
            environment: 'app',
            connected: false,
            router: react_router_1.MemoryRouter,
            routerSettings: {
                initialEntries: ['/'],
                initialIndex: 0
            }
        }), document.getElementById('falcon-container'));
    });
}
else {
    electron.remote.app.quit();
}
//# sourceMappingURL=app.electron.js.map