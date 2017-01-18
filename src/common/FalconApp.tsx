/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

//https://react-router.now.sh/Match

import * as React from 'react';
import { Match, Miss } from 'react-router';

import { RouteNotFound } from './views/RouteNotFound';

import { ApiService, AppUrls } from './ApiService';

import { itemTypes } from './itemTypes';

import { Admin } from './views/Admin';
import { AdminApp } from '../app/AdminApp';

import { User } from './views/User';
import { UserManagement } from './views/UserManagement';
import { AppDownload } from './views/AppDownload';
import { DatabaseUpload } from './views/DatabaseUpload';

import { Link } from 'react-router';
import { ObjectEditor } from './views/ObjectEditor';

import { GeneralStatistics } from './stats/GeneralStatistics';

interface FalconAppProps {
    router: any;
    api: ApiService;
    routerSettings: any;
    environment: 'app' | 'website';
    connected: boolean;
}

interface FalconAppState {
    user: string;
    tabsets: any[];
    stats: GeneralStatistics | null;
}

export class FalconApp extends React.Component<FalconAppProps, FalconAppState> {

    constructor(props: FalconAppProps) {
        super();
        this.state = {
            user: '',
            stats: null,
            tabsets: []
        };
    }

    public componentDidMount() {
        if (this.props.environment === 'website' && window !== undefined) {
            fetch('/admin/currentuser', { credentials: 'same-origin' })
                .then((response) => response.json())
                .then((userData) => this.setState({ user: userData.username }));

            fetch('/admin/tabset', { credentials: 'same-origin' })
                .then((response) => response.json())
                .then((tabsets) => this.setState({ tabsets }));
        }

        this.props.api.getStats()
        .then((stats) => {
          this.setState({ stats })
        });
    }

    public render() {
        return (
        <div id='main' className='flex-fill'>
            <this.props.router {...this.props.routerSettings} className='flex-fill' basename='/admin'>
                <div className='flex-fill' style={{ flexDirection: 'column' }}>
                    <div className='header'>
                        <Link to='/' className='logo-link'><div className='logo'>VRE</div></Link>
                        <Link to='/' className='header-link'>Home</Link>
                        <Link accessKey='s' to={'/edit/' + AppUrls.source} className='header-link source'>{itemTypes.source.plural}</Link>
                        <Link accessKey='e' to={'/edit/' + AppUrls.entity} className='header-link entity'>{itemTypes.entity.plural}</Link>
                        <Link accessKey='p'
                            to={'/edit/' + AppUrls.predicate} className='header-link predicate'>{itemTypes.predicate.plural}</Link>
                        <Link accessKey='t'
                            to={'/edit/' + AppUrls.entity_type} className='header-link entity_type'>{itemTypes.entity_type.plural}</Link>

                        { this.props.environment === 'website' ? (
                            <div className='right-header'>
                                <Link to='/user' className='header-link'><span className='current-user'>{this.state.user}</span></Link>
                                <a href='/admin/logout' className='header-link'>Logout</a>
                                <a href='/' className='header-link'><i className='fa fa-external-link'></i></a>
                            </div>
                        ) : null}

                    </div>

                    { this.props.environment === 'website' ? (
                        <Match exactly pattern='/' render={
                        (matchprops) => (
                          <Admin {...matchprops} stats={this.state.stats} tabsets={this.state.tabsets}/>
                        )}/>
                    ) : (
                        <Match exactly pattern='/' render={
                        (matchprops) => (
                          <AdminApp {...matchprops} stats={this.state.stats}/>
                        )}/>
                    )}

                    <Match exactly pattern='/user' component={User} />
                    <Match exactly pattern='/users' component={UserManagement} />
                    <Match exactly pattern='/app' component={AppDownload} />
                    <Match exactly pattern='/upload' component={DatabaseUpload} />

                    <Match exactly pattern='/search' render={
                        (matchprops) => (
                            <ObjectEditor
                                api={this.props.api} {...matchprops}
                                workspace={'search'} />)
                    } />

                    <Match pattern='/edit/:workspace' render={
                        (matchprops) => (
                            <ObjectEditor
                                api={this.props.api} {...matchprops}
                                workspace={matchprops.params.workspace === 'property' ? 'predicate' : matchprops.params.workspace}
                                />)
                    } />

                    <Miss component={RouteNotFound} />
                </div>
            </this.props.router>
        </div>);
    }

}
