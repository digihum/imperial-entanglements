/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { Match, Miss } from 'react-router';

import { RouteNotFound } from './views/RouteNotFound';

import { ApiService, AppUrls } from './ApiService';

import { itemTypes } from './itemTypes';

import { Admin } from './views/Admin';
import { AdminApp } from '../app/AdminApp';

import { Link } from 'react-router';
import { ObjectEditor } from './views/ObjectEditor';

interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
    environment: 'app' | 'website';
    connected: boolean;
}

interface FalconAppState {
    user: string;
}

export class FalconApp extends React.Component<FalconAppProps, FalconAppState> {

    constructor() {
        super();
        this.state = {
            user: ''
        };
    }

    public componentDidMount() {
        if (this.props.environment === 'website' && window !== undefined) {
            fetch('/admin/currentuser', { credentials: 'same-origin' })
                .then((response) => response.json())
                .then((userData) => this.setState({ user: userData.username }));
        }
    }

    public render() {
        return (
        <div id='main' className='flex-fill'>
            <this.props.router {...this.props.routerSettings} className='flex-fill' basename='/admin'>
                <div className='flex-fill' style={{ flexDirection: 'column' }}>
                    <div className='header'>
                        <div className='logo'>VRE</div>
                        <Link to='/' className='header-link'>Home</Link>
                        <Link accessKey='e' to={'/edit/' + AppUrls.entity} className='header-link'>{itemTypes.entity.plural}</Link>
                        <Link accessKey='p'
                            to={'/edit/' + AppUrls.predicate} className='header-link'>{itemTypes.predicate.plural}</Link>
                        <Link accessKey='s' to={'/edit/' + AppUrls.source} className='header-link'>{itemTypes.source.plural}</Link>
                        <Link accessKey='t'
                            to={'/edit/' + AppUrls.entity_type} className='header-link'>{itemTypes.entity_type.plural}</Link>

                        { this.props.environment === 'website' ? (
                            <div className='right-header'>
                                <span className='current-user'>{this.state.user}</span>
                                <a href='/admin/logout'>Logout</a>
                            </div>
                        ) : null}

                    </div>

                    { this.props.environment === 'website' ? (
                        <Match exactly pattern='/' component={Admin} />
                    ) : (
                        <Match exactly pattern='/' component={AdminApp} />
                    )}

                    <Match exactly pattern='/search' render={
                        (matchprops) => (
                            <ObjectEditor
                                api={this.props.api} {...matchprops} 
                                workspace={'search'} />)
                    } />


                   <Match exactly pattern='/edit/notfound' render={
                        (matchprops) => (
                            <ObjectEditor
                                api={this.props.api} {...matchprops} 
                                workspace={'notfound'} />)
                    } />

                    {Object.keys(itemTypes).map((name) => [name, itemTypes[name]]).map(([name, itemType]) => ([

                            <Match
                                exactly key={`${name}-cv`}
                                pattern={`/edit/${itemType.machineName}`}
                                render={
                                    (matchprops) => (
                                        <ObjectEditor
                                            api={this.props.api} {...matchprops} 
                                            workspace={itemType.workspace}
                                            name={itemType.plural} 
                                            list={true} />)
                                } />,

                            <Match
                                exactly key={`${name}-iv`}
                                pattern={`/edit/${itemType.machineName}/:id`}
                                className="flex-fill"
                                render={
                                    (matchprops) => (
                                        <ObjectEditor
                                        api={this.props.api} {...matchprops}
                                        workspace={itemType.workspace}
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