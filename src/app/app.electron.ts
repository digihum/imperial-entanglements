/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { render } from 'react-dom';
import { createElement } from 'react';
import { FalconApp } from '../common/FalconApp';
import { Database } from '../backend/data/Database';
import { wrapDatabase } from '../backend/data/wrapDatabase';
import { MemoryRouter } from 'react-router';

import * as electron from 'electron';

const databaseFile = electron.remote.dialog.showOpenDialog({properties: ['openFile'],  filters: [
    {name: 'Database Files', extensions: ['sqlite']}
  ]});

if (databaseFile !== undefined) {

  electron.remote.getCurrentWindow().setTitle(`Imperial Entanglements (${databaseFile[0]})`);

  const db = new Database({
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
    //debug: true
  });

  document.addEventListener('DOMContentLoaded', (event) => {
      render(createElement(FalconApp, {
          api: wrapDatabase(db, true),
          environment: 'app',
          connected: false,
          router: MemoryRouter,
          routerSettings: {
            initialEntries: ['/'],
            initialIndex: 0
          }
      }), <Element>document.getElementById('falcon-container'));
  });
} else {
  electron.remote.app.quit();
}


