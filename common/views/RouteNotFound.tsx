/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { PageProps } from '../routeUrls';

export const RouteNotFound = (props: PageProps) => (
    <section>
        <h1>The page at {props.url} does not exist :(</h1>
    </section>
) ;
