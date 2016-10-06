/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { render } from 'react-dom';
import { createElement } from 'react';
import { FalconApp } from '../common/FalconApp';
import { Database } from '../server/core/Database';
import { wrapDatabase } from '../server/routes/api';
import { MemoryRouter } from 'react-router';

const db = new Database({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
    render(createElement(FalconApp, {
        api: wrapDatabase(db),
        router: MemoryRouter,
        routerSettings: {
           initialEntries: ['/'],
           initialIndex: 0
        }
    }), <Element>document.getElementById('falcon-container'));
});

