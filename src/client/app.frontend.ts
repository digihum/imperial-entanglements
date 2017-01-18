/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import { render } from 'react-dom';
import { createElement } from 'react';
import { FalconApp } from '../common/FalconApp';
import { ClientApiService } from './ClientApiService';
import { BrowserRouter } from 'react-router';

document.addEventListener('DOMContentLoaded', (event) => {
    render(createElement(FalconApp, {
        api: new ClientApiService(),
        router: BrowserRouter,
        routerSettings: {},
        environment: 'website',
        connected: true
    }), <Element>document.getElementById('main'));
});

