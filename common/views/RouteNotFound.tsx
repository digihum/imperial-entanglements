/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { PageProps } from '../routeUrls';

export const RouteNotFound = (props: PageProps) => (
    <section>
        <h1>The page at {props.url} does not exist :(</h1>
    </section>
) ;
