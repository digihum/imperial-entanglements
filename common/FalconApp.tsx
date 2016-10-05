/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { Match, Miss } from 'react-router';

import { RouteNotFound } from './views/RouteNotFound';

import { ApiService } from './ApiService';

import { routeUrls } from './routeUrls';
import { Home } from './views/Home';

interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
}

export const FalconApp = (props : FalconAppProps) => (
    <div id='main'>
        <props.router {...props.routerSettings}>
            <div>
                <div>
                    <h1>Header!</h1>
                </div>

                <Match exactly pattern='/' component={Home} />

                {Object.keys(routeUrls).map((name) => [name, routeUrls[name]]).map(([name, routeUrl]) => ([

                        <Match
                            exactly key={`${name}-cv`}
                            pattern={`/${routeUrl.url}`}
                            render={
                                (matchProps) => (<routeUrl.collectionView api={props.api} {...matchProps} />)
                            } />,

                        <Match
                            exactly key={`${name}-iv`}
                            pattern={`/${routeUrl.url}/:id`}
                            render={
                                (matchProps) => (<routeUrl.itemView api={props.api} {...matchProps} />)
                            } />,

                        <Match
                            exactly key={`${name}-ce`}
                            pattern={`/admin/edit/${routeUrl.url}`}
                             render={
                                (matchProps) => (<routeUrl.collectionEdit api={props.api} {...matchProps} />)
                            }/>,

                        <Match
                            exactly key={`${name}-ie`}
                            pattern={`/admin/edit/${routeUrl.url}`}
                            render={
                                (matchProps) => (<routeUrl.itemEdit api={props.api} {...matchProps} />)
                            } />
                ]
                ))}

                <Miss component={RouteNotFound} />
            </div>
        </props.router>
    </div>
);