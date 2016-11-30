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
import { closeTab, reorderTabs } from '../Signaller';

import { capitalize } from 'lodash';

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

export interface Tab {
    tabType: string;
    uid: number;
    data?: any;
}

const Handle = SortableHandle((props: {tabType: string}) => (
  <div className='badge-container'>
      <div className={'badge ' + props.tabType}>
          <span>{props.tabType[0].toUpperCase()}</span>
      </div>
  </div>
));

const Card = SortableElement((props: {currentTab: boolean, url: string, tab: Tab, title: string, subtitle: string,
            compact: boolean}) => (
      <li key={`${props.url}`}>
          <div className={((currentTab) => {
              const classes = ['sidebar-card'];
              if (currentTab) {
                  classes.push('current');
              }
              if (props.compact) {
                  classes.push('compact');
              }
              return classes.join(' ');
          })(props.currentTab)}>
              <Handle tabType={props.tab.tabType} index={props.index} collection={props.collection} disabled={props.disabled}/>
              <div className='description'>
                  <Link to={props.url}>
                      <span className='entity-name'>{props.title}</span>
                      {props.compact ? null : (
                          <span className='entity-type'>{props.subtitle}</span>
                      )}
                  </Link>
              </div>
              {!props.currentTab ? (
                  <span className='close-button'>
                      <i className='fa fa-times' onClick={(e) => this.closeTab(e, props.tab.tabType, props.tab.uid)}></i>
                  </span>
              ) : null}
          </div>
      </li>
  ));

const CardList = SortableContainer((props: {
    dataStore: DataStore,
    loading: boolean,
    tabs: Tab[],
    list: boolean,
    workspace: string,
    id: number,
    compact: boolean}) => {

    return (
      <ul className='card-list'>
            {!props.loading ? props.tabs.map((tab, index) => {

                // TODO: shouldn't be ==
                const item = props.dataStore.all[tab.tabType].value
                    .find((item) => item.uid == tab.uid);

                if (item === undefined) {
                    return null;
                }

                const url = `/edit/${AppUrls[tab.tabType]}/${tab.uid}`;
                const title = tab.tabType === 'entity' ? item.label : item.name;
                const subtitle = `${capitalize(AppUrls[tab.tabType]).replace('_', ' ')} ${tab.uid}`;

                const currentTab = !props.list && tab.tabType === props.workspace && tab.uid == props.id;

              return (
                 <Card
                  key={`tab-${index}`}
                  currentTab={currentTab}
                  url={url}
                  tab={tab}
                  title={title}
                  subtitle={subtitle}
                  index={index}
                  compact={props.compact}
                />
              );
        }) : null}
        </ul>
    );
});


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

    public onSortEnd = ({oldIndex, newIndex}) => {
      reorderTabs.dispatch((tabs) => {
        return arrayMove(tabs, oldIndex, newIndex);
      });
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
                 <CardList
                    dataStore={this.props.dataStore}
                    loading={this.props.loading}
                    tabs={this.props.tabs}
                    list={this.props.list}
                    workspace={this.props.workspace}
                    id={this.props.id}
                    compact={this.state.compactMode}
                    onSortEnd={this.onSortEnd}
                    useDragHandle={true}
                  />
                </div>
            </section>
        );
    }
}
