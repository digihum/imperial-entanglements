/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { Match, Miss } from 'react-router';

import { RouteNotFound } from './views/RouteNotFound';

import { ApiService } from './ApiService';

import { routeUrls } from './routeUrls';
import { Home } from './views/Home';

import { Admin } from './views/Admin';

import { Link } from 'react-router';
import { ObjectEditor } from './views/ObjectEditor';

import { globalClick } from './Signaller';


interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
}

interface FalconAppState {

}

export class FalconApp extends React.Component<FalconAppProps, FalconAppState> {

    constructor() {
        super();
    }

    public onClickSignal() {
        globalClick.dispatch();
    }

    public render() {
        return (
        <div id='main' className="flex-fill" onClick={this.onClickSignal.bind(this)}>
            <this.props.router {...this.props.routerSettings} className="flex-fill" basename='/admin'>
                <div className="flex-fill" style={{ flexDirection: 'column' }}>
                    <div className='header'>
                        <h1>VRE</h1>
                        <Link to='/' className='header-link'>Home</Link>
                        <Link to='/edit/entity' className='header-link'>Entities</Link>
                        <Link to='/edit/predicate' className='header-link'>Predicates</Link>
                        <Link to='/edit/source' className='header-link'>Sources</Link>
                        <Link to='/edit/entity_type' className='header-link'>Entity Types</Link>

                        <div className='right-header'>
                            <a href='/admin/logout'>Logout</a>
                        </div>
                    </div>

                    <Match exactly pattern='/' component={Admin} />

                    <Match exactly pattern='/search' render={
                        (matchprops) => (
                            <ObjectEditor
                                api={this.props.api} {...matchprops} 
                                workspace={'search'} />)
                    } />

                    {Object.keys(routeUrls).map((name) => [name, routeUrls[name]]).map(([name, routeUrl]) => ([

                            <Match
                                exactly key={`${name}-cv`}
                                pattern={`/edit/${routeUrl.url}`}
                                render={
                                    (matchprops) => (
                                        <routeUrl.collectionView
                                            api={this.props.api} {...matchprops} 
                                            workspace={routeUrl.workspaceType}
                                            name={routeUrl.plural} 
                                            list={true} />)
                                } />,

                            <Match
                                exactly key={`${name}-iv`}
                                pattern={`/edit/${routeUrl.url}/:id`}
                                className="flex-fill"
                                render={
                                    (matchprops) => (
                                        <routeUrl.itemView 
                                        api={this.props.api} {...matchprops}
                                        workspace={routeUrl.workspaceType}
                                        list={false} />)
                                } />
                    ]
                    ))}

                    <Miss component={RouteNotFound} />
                </div>
            </this.props.router>
        </div>);
    }

}