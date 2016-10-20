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

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { reducer } from './reducer';

interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
}

interface FalconAppState {

}

export class FalconApp extends React.Component<FalconAppProps, FalconAppState> {

    private reduxStore: Redux.Store<any>;

    constructor() {
        super();
        this.reduxStore = createStore(reducer);
    }

    public onClickSignal() {
        globalClick.dispatch();
    }

    public render() {
        return (
    <Provider store={this.reduxStore}>
        <div id='main' className="flex-fill" onClick={this.onClickSignal.bind(this)}>
            <this.props.router {...this.props.routerSettings} className="flex-fill">
                <div className="flex-fill" style={{ flexDirection: 'column' }}>
                    <div className='header'>
                        <h1>VRE</h1>
                        <Link to='/' className='header-link'>Home</Link>
                        <Link to='/entity' className='header-link'>Entities</Link>
                        <Link to='/predicate' className='header-link'>Predicates</Link>
                        <Link to='/source' className='header-link'>Sources</Link>
                        <Link to='/entity_type' className='header-link'>Entity Types</Link>
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
                                            workspace={routeUrl.workspaceType}
                                            name={routeUrl.plural} 
                                            list={true} />)
                                } />,

                            <Match
                                exactly key={`${name}-iv`}
                                pattern={`/${routeUrl.url}/:id`}
                                className="flex-fill"
                                render={
                                    (matchprops) => (
                                        <routeUrl.itemView 
                                        api={this.props.api} {...matchprops}
                                        workspace={routeUrl.workspaceType}
                                        list={false} />)
                                } />,

                            <Match
                                exactly key={`${name}-ce`}
                                pattern={`/admin/edit/${routeUrl.url}`}
                                render={
                                    (matchprops) => (
                                        <routeUrl.collectionEdit 
                                        api={this.props.api} {...matchprops}
                                        workspace={routeUrl.workspaceType} 
                                        list={true}/>)
                                }/>,

                            <Match
                                exactly key={`${name}-ie`}
                                pattern={`/admin/edit/${routeUrl.url}`}
                                render={
                                    (matchprops) => (
                                        <routeUrl.itemEdit 
                                        api={this.props.api} {...matchprops} 
                                        workspace={routeUrl.workspaceType}
                                        list={false} />)
                                } />
                    ]
                    ))}

                    <Miss component={RouteNotFound} />
                </div>
            </this.props.router>
        </div>
    </Provider>);
    }

}