/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { render } from 'react-dom';
import { createElement } from 'react';
import { FalconApp } from '../common/FalconApp';
import { ServerApiService } from '../server/core/ServerApiService';
import { MemoryRouter } from 'react-router';

document.addEventListener('DOMContentLoaded', (event) => {
    render(createElement(FalconApp, {
        api: ServerApiService,
        router: MemoryRouter,
        location: window.location,
        routerSettings: {
           initialEntries: ['/'],
           initialIndex: 0 
        }
    }), document.getElementById('main'));
});

