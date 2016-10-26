/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { SearchBox } from './sidebar/SearchBox';
import { AppUrls } from '../ApiService';
import { Link } from 'react-router';
import { DataStore } from '../DataStore';
import { closeTab } from '../Signaller';

export interface Tab {
    tabType: string;
    uid: number;
    data?: any;
}

interface SidebarProps {
    tabs: Tab[];
    dataStore: DataStore;
    loading: boolean;
}

interface SidebarState {
    searchString: string;
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {

    constructor() {
        super();
        this.state = {
            searchString: ''
        };
    }

    public closeTab(e: React.MouseEvent, tabType: string, uid: number) {
        closeTab.dispatch(tabType, uid);
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
    }

    public render() {

        if (this.props.loading) {
            return (<div></div>);
        }

        return (
            <section id='sidebar'>
                <SearchBox searchString={this.state.searchString}
                onChange={(evt) => this.setState({searchString: evt.currentTarget.value})} />
                <ul className='card-list'>
                    {this.props.tabs.map((tab) => {

                        const item = this.props.dataStore[tab.tabType].get(tab.tabType).value
                            .find((item) => item.uid === tab.uid);

                        const url = `/${AppUrls[tab.tabType]}/${tab.uid}`;
                        const title = `${AppUrls[tab.tabType]}/${tab.uid}`;
                        const subtitle = `${AppUrls[tab.tabType]}/${tab.uid}`;

                        return (
                        <li key={`${url}`}>
                            <div className='sidebar-card'>
                                <div className='badge-container'>
                                    <div className={'badge ' + tab.tabType}>
                                        <span>{tab.tabType[0].toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className='description'>
                                    <Link to={url}>
                                        <span className='entity-name'>{title}</span>
                                        <span className='entity-type'>{subtitle}</span>
                                    </Link>
                                </div>
                                <span className='close-button'>
                                    <i className='fa fa-times' onClick={(e) => this.closeTab(e, tab.tabType, tab.uid)}></i>
                                </span>
                            </div>
                        </li>
                    );
                })}
                </ul>
            </section>
        );
    }
}
