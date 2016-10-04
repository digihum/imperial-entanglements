/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { BrowserRouter, Match, Link } from 'react-router';

import { ApiService } from './ApiService';

import { routeUrls } from './routeUrls';

interface FalconAppProps {
    router: any;
    api: ApiService;
    location: string;
}

export const FalconApp = (props) => (
    <props.router>
        <div>
            <h1>Header!</h1>
        </div>

        {Object.keys(routeUrls).map((name) => (
            <span>
                <Match pattern={`/${routeUrls[name].url}`} component={routeUrls[name].collectionView} />
                <Match pattern={`/${routeUrls[name].url}/:id`} component={routeUrls[name].itemView} />

                <Match pattern={`/admin/edit/${routeUrls[name].url}`} component={routeUrls[name].collectionEdit} />
                <Match pattern={`/admin/edit/${routeUrls[name].url}`} component={routeUrls[name].itemEdit} />
            </span>
        ))}

    </props.router>
);