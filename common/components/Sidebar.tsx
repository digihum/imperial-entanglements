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

import { capitalize } from 'lodash';

export interface Tab {
    tabType: string;
    uid: number;
    data?: any;
}

interface SidebarProps {
    tabs: Tab[];
    dataStore: DataStore;
    loading: boolean;
    clearTabs: any;
    workspace: string;
    list: boolean;
    id: number;
}

interface SidebarState {
    searchString: string;
    compactMode: boolean;
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {

    constructor() {
        super();
        this.state = {
            searchString: '',
            compactMode: false
        };
    }

    public closeTab(e: React.MouseEvent, tabType: string, uid: number) {
        closeTab.dispatch(tabType, uid);
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
    }

    public render() {

        return (
            <section id='sidebar'>
                <SearchBox searchString={this.state.searchString}
                dataStore={this.props.dataStore}
                onChange={(evt) => this.setState({searchString: evt.currentTarget.value})} />
                <div className='sidebar-toolbar'>
                    <button onClick={this.props.clearTabs}><i className='fa fa-trash'></i> Clear All</button>
                    <button onClick={() => this.setState({compactMode: !this.state.compactMode})}><i className='fa fa-compress'></i> Compact</button>
                </div>
                <div className='card-list-container'>
                    <ul className='card-list'>
                        {!this.props.loading ? this.props.tabs.map((tab) => {

                            // TODO: shouldn't be ==
                            const item = this.props.dataStore.all[tab.tabType].value
                                .find((item) => item.uid == tab.uid);

                            if (item === undefined) {
                                return null;
                            }

                            const url = `/edit/${AppUrls[tab.tabType]}/${tab.uid}`;
                            const title = tab.tabType === 'entity' ? item.label : item.name;
                            const subtitle = `${capitalize(AppUrls[tab.tabType]).replace('_', ' ')} ${tab.uid}`;

                            const currentTab = !this.props.list && tab.tabType === this.props.workspace && tab.uid == this.props.id;

                            return (
                            <li key={`${url}`}>
                                <div className={((currentTab) => {
                                    const classes = ['sidebar-card'];
                                    if (currentTab) {
                                        classes.push('current');
                                    }
                                    if (this.state.compactMode) {
                                        classes.push('compact');
                                    }
                                    return classes.join(' ');
                                })(currentTab)}>
                                    <div className='badge-container'>
                                        <div className={'badge ' + tab.tabType}>
                                            <span>{tab.tabType[0].toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <div className='description'>
                                        <Link to={url}>
                                            <span className='entity-name'>{title}</span>
                                            {this.state.compactMode ? null : (
                                                <span className='entity-type'>{subtitle}</span>
                                            )}
                                        </Link>
                                    </div>
                                    {!currentTab ? (
                                        <span className='close-button'>
                                            <i className='fa fa-times' onClick={(e) => this.closeTab(e, tab.tabType, tab.uid)}></i>
                                        </span>
                                    ) : null}
                                </div>
                            </li>
                        );
                    }) : null}
                    </ul>
                </div>
            </section>
        );
    }
}
