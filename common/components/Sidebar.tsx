/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { SearchBox } from './sidebar/SearchBox';
import { Link } from 'react-router';
import { closeTab } from '../Signaller';

export interface Tab {
    title: string;
    subtitle: string;
    url: string;
}

interface SidebarProps {
    tabs: Tab[];
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

    public closeTab(e: React.MouseEvent, url: string) {
        closeTab.dispatch(url);
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
    }

    public render() {
        return (
            <section id='sidebar'>
                <SearchBox searchString={this.state.searchString}
                onChange={(evt) => this.setState({searchString: evt.currentTarget.value})} />
                <ul className='card-list'>
                    {this.props.tabs.map((tab) => (
                        <li key={`${tab.url}`}>
                            <Link to={tab.url}>
                                <div className='sidebar-card'>
                                    <div className='badge-container'>
                                        <div className='badge'>
                                            <span>E</span>
                                        </div>
                                    </div>
                                    <div className='description'>
                                        <span className='entity-name'>{tab.title}</span>
                                        <span className='entity-type'>{tab.subtitle}</span>
                                    </div>
                                    <span className='close-button'>
                                        <i className='fa fa-times' onClick={(e) => this.closeTab(e, tab.url)}></i>
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}

                </ul>
            </section>
        );
    }
}
