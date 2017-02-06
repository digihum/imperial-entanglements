/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

export const RouteNotFound = (props: { url: string }) => (
    <section>
        <h1>The page at {props.url} does not exist :(</h1>
    </section>
) ;
