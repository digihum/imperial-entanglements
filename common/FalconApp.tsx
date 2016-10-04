/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { Match, Miss, createServerRenderContext  } from 'react-router';

import { RouteNotFound } from './views/RouteNotFound';

import { ApiService } from './ApiService';

import { routeUrls } from './routeUrls';
import { Home } from './views/Home';

interface FalconAppProps {
    router: any;
    api: ApiService;
    location: string;
}

const context = createServerRenderContext();

export const FalconApp = (props : FalconAppProps) => (
    <div id='main'>
        <props.router location={props.location} context={context}>
            <div>
                <div>
                    <h1>Header!</h1>
                </div>

                <Match exactly pattern='/' component={Home} />

                {Object.keys(routeUrls).map((name) => ([

                        <Match
                            exactly key={`${name}-cv`}
                            pattern={`/${routeUrls[name].url}`}
                            component={routeUrls[name].collectionView}
                            api={props.api}
                            url={props.location} />,

                        <Match
                            exactly key={`${name}-iv`}
                            pattern={`/${routeUrls[name].url}/:id`}
                            component={routeUrls[name].itemView} />,

                        <Match
                            exactly key={`${name}-ce`}
                            pattern={`/admin/edit/${routeUrls[name].url}`}
                            component={routeUrls[name].collectionEdit} />,

                        <Match
                            exactly key={`${name}-ie`}
                            pattern={`/admin/edit/${routeUrls[name].url}`}
                            component={routeUrls[name].itemEdit} />
                ]
                ))}

                <Miss component={RouteNotFound} url={props.location} />
            </div>
        </props.router>
    </div>
);