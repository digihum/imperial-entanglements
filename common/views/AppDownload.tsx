/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';

export const AppDownload = (props) => (
    <div className='page'>
        <section>
            <h1>App Download</h1>
            <p>Use this VRE without an internet connection! Simply download the app for your platform and then
            download a database snapshot from the main page. When you are ready, use the upload tool to merge
            your offline copy with the server.</p>
            <ul className='links-list'>
              <li><a href='https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements%20Setup%200.1.1.exe'><i className='fa fa-windows'></i> Windows</a></li>
              <li><a href='https://github.com/digihum/imperial-entanglements-app/raw/master/bin/mac/imperial-entanglements-0.1.1.dmg'><i className='fa fa-apple'></i> Mac</a></li>
              <li><a href='https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements-0.1.1-x86_64.AppImage'><i className='fa fa-linux'></i> Linux</a></li>
            </ul>
        </section>
    </div>
);
