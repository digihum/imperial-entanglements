/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';

export const Admin = (props) => (
    <div className='page'>
        <section>
            <h1>This is the admin page</h1>
            <ul>
                <li>Manage Users</li>
                <li>Download app</li>
                <li>Download database snapshot</li>
            </ul>
        </section>
    </div>
);
