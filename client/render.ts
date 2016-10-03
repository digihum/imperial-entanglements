/**
 * @fileOverview Abstract interface for sources
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import {render} from 'react-dom';
import {createElement} from 'react';
import { home } from '../common/views/home';

document.addEventListener('DOMContentLoaded', (event) => {
    render(createElement(home, null), document.getElementById('main'));
});

