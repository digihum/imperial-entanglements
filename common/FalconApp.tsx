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

    public onClickSignal() {
        globalClick.dispatch();
    }

    public render() {
        return (
    <div id='main' className="flex-fill" onClick={this.onClickSignal.bind(this)}>
        <this.props.router {...this.props.routerSettings} className="flex-fill">
            <div className="flex-fill" style={{ flexDirection: 'column' }}>
                <div className='header'>
                    <h1>VRE</h1>
                    <Link to='/'>Home</Link>
                </div>

                <Match exactly pattern='/' component={Home} />

                <Match exactly pattern='/search' render={
                    (matchprops) => (
                        <ObjectEditor
                            api={this.props.api} {...matchprops} 
                            workspace={'search'} />)
                } />

                {Object.keys(routeUrls).map((name) => [name, routeUrls[name]]).map(([name, routeUrl]) => ([

                        <Match
                            exactly key={`${name}-cv`}
                            pattern={`/${routeUrl.url}`}
                            render={
                                (matchprops) => (
                                    <routeUrl.collectionView
                                        api={this.props.api} {...matchprops} 
                                        workspace='list'
                                        name={routeUrl.plural} />)
                            } />,

                        <Match
                            exactly key={`${name}-iv`}
                            pattern={`/${routeUrl.url}/:id`}
                            className="flex-fill"
                            render={
                                (matchprops) => (
                                    <routeUrl.itemView 
                                    api={this.props.api} {...matchprops}
                                    workspace={routeUrl.workspaceType} />)
                            } />,

                        <Match
                            exactly key={`${name}-ce`}
                            pattern={`/admin/edit/${routeUrl.url}`}
                             render={
                                (matchprops) => (
                                    <routeUrl.collectionEdit 
                                    api={this.props.api} {...matchprops}
                                    workspace={routeUrl.workspaceType} />)
                            }/>,

                        <Match
                            exactly key={`${name}-ie`}
                            pattern={`/admin/edit/${routeUrl.url}`}
                            render={
                                (matchprops) => (
                                    <routeUrl.itemEdit 
                                    api={this.props.api} {...matchprops} 
                                    workspace={routeUrl.workspaceType} />)
                            } />
                ]
                ))}

                <Miss component={RouteNotFound} />
            </div>
        </this.props.router>
    </div>)
    }

}