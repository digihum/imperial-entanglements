/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Link } from 'react-router';

export const Home = (props) => (
    <div id='main'>
        <section>
            <h1>This is the home page</h1>
            <Link to='/entity/1'>Entity 1</Link>
        </section>
    </div>
) ;
