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

import { capitalize, isArray } from 'lodash';

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

export interface Tab {
    tabType: string;
    tabClass: string;
    uid: number;
    query?: { [s: string]: string };
    data?: any;
}

const Handle = SortableHandle((props: {tabType: string}) => (
  <div className='badge-container'>
      <div className={'badge ' + props.tabType}>
          <span>{props.tabType[0].toUpperCase()}</span>
      </div>
  </div>
));

const onCloseTab = (e: React.MouseEvent, tabType: string, uid: number) => {
    closeTab.dispatch(tabType, uid);
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
}

const Card = SortableElement((props: {currentTab: boolean, url: any, index: number, tab: Tab, title: string, subtitle: string | string[],
            compact: boolean}) => (
      <li key={`${props.url}`}>
          <div className={((currentTab) => {
              const classes = ['sidebar-card', props.tab.tabClass];
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
                      {props.compact ? null : isArray(props.subtitle) ? (
                        <ul>{props.subtitle.map((sub, i) => (<li key={`tab-${props.index}-${i}`}>{sub}</li>))}</ul>
                      ) : (
                          <span className='entity-type'>{props.subtitle}</span>
                      )}
                  </Link>
              </div>
              {!props.currentTab ? (
                  <span className='close-button'>
                      {props.tab.tabType === 'source' ? (
                        <i className='fa fa-unlock'></i>
                      ) : null}
                      <i className='fa fa-times' onClick={(e) => onCloseTab(e, props.tab.tabType, props.tab.uid)}></i>
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

                let url : string | Object | null = null;
                if (tab.tabClass === 'item') {
                  url = `/edit/${AppUrls[tab.tabType]}/${tab.uid}`;
                } else {
                  if (tab.tabClass === 'view') {
                    url = {
                      pathname: `/edit/${AppUrls[tab.tabType]}`,
                      query: tab.data
                    };
                  }
                }

                const subtitle = tab.tabClass === 'item' ?
                  capitalize(AppUrls[tab.tabType]).replace('_', ' ') + ' ' + tab.uid
                  : Object.keys(tab.data).map((title) => `${title}: ${tab.data[title]}`);

                const title = item === undefined ? `${tab.tabType} list` : item.label;

                const currentTab = !props.list && tab.tabType === props.workspace && tab.uid == props.id;

              return (
                 <Card
                  key={`tab-${tab.tabType}-${tab.tabClass}-${tab.uid}-${tab.query}`}
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
    reorderTabs: (tabCallback: (tabs: Tab[]) => Tab[]) => void;
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

    public onSortEnd = ({oldIndex, newIndex}) => {
      this.props.reorderTabs((tabs : Tab[]) => arrayMove(tabs, oldIndex, newIndex));
    }

    public render() {

        return (
            <section id='sidebar'>
                <SearchBox searchString={this.state.searchString}
                dataStore={this.props.dataStore}
                onChange={(evt) => this.setState({searchString: (evt.currentTarget as HTMLInputElement).value})} />
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
                    helperClass={'card-being-dragged'}
                  />
                </div>
            </section>
        );
    }
}
