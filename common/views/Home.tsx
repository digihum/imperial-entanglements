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
            <ul>
                <li><Link to='/entity/1'>Entity 1</Link></li>
                <li><Link to='/predicate/1'>Predicate 1</Link></li>
                <li><Link to='/predicate/2'>Predicate 2</Link></li>
               <li> <Link to='/source/1'>Source 1</Link></li>
            </ul>

            <button>New Entity</button>
            <button>New Source</button>
            <button>New Predicate</button>
        </section>
    </div>
);
