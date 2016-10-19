/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';

export const Home = (props) => (
    <div className='page'>
        <section>
            <h1>This is the home page</h1>
            <ul>
                <li><Link to='/entity/1'>Entity 1</Link></li>
                <li><Link to='/predicate/1'>Predicate 1</Link></li>
                <li><Link to='/predicate/2'>Predicate 2</Link></li>
               <li> <Link to='/source/1'>Source 1</Link></li>
            </ul>
        </section>
    </div>
);
