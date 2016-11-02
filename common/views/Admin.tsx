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
            <h1>Welcome to the admin pages</h1>
            <ul>
                <li>Manage Users</li>
                <li>Download app</li>
                <li><a href='/admin/snapshot'>Download database snapshot</a></li>
            </ul>
        </section>
     </div>
);
