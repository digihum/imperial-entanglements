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

import { Link } from 'react-router';

interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
}

export const FalconApp = (props : FalconAppProps) => (
    <div id='main' className="flex-fill">
        <props.router {...props.routerSettings} className="flex-fill">
            <div className="flex-fill" style={{ flexDirection: 'column' }}>
                <div style={{ backgroundColor: '#0099e6', padding: '0.2em 1em'}}>
                    <h1>Header!</h1>
                    <Link to='/'>Home</Link>
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
                            className="flex-fill"
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