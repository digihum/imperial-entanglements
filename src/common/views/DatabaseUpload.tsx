/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { Link } from 'react-router';

export const DatabaseUpload = (props) => (
    <div className='page'>
        <section>
            <h1>This is the database upload page</h1>
            <input type='file' id='input' accept='.sqlite' />
            <button onClick={() => { alert('Work in process')}}>Upload</button>
        </section>
    </div>
);
