/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { SearchBox } from './sidebar/SearchBox';
import { AppUrls } from '../ApiService';
import { Link } from 'react-router';
import { DataController } from '../stores/DataController';

import { capitalize, noop, isObject } from 'lodash';

import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

import { ModalStore } from '../stores/ModalStore';

import { inject, observer } from 'mobx-react';


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

const onCloseTab = (e: React.MouseEvent, tabType: string, uid: number, dataStore: DataController) => {
    dataStore.closeTab(tabType, uid);
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
}

const Card = SortableElement(observer((props: {dataStore: DataController, currentTab: boolean, url: any, index: number, tab: Tab, title: string, subtitle: string | string[],
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
                      {props.compact ? null : isObject(props.subtitle) ? (
                        <ul>{Object.keys(props.subtitle).map((sub, i) => (
                          <li key={`tab-${props.index}-${i}`}>
                            { sub }:
                            {
                              isObject(props.subtitle[sub]) ? (
                                <span>
                                  <ul>
                                    {Object.keys(props.subtitle[sub]).map((subSub, j) =>
                                      (<li key={`tab-${props.index}-${i}-${j}`}>{subSub}: {props.subtitle[sub][subSub]}</li>))}
                                  </ul>
                                </span>
                              ) : null
                            }
                          </li>))}
                        </ul>
                      ) : (
                          <span className='entity-type'>{props.subtitle}</span>
                      )}
                  </Link>
              </div>
              <span className='lock-button'>
                  {props.tab.tabType === 'source' ? (
                    props.dataStore.defaultSource === props.tab.uid ?
                    (<i onClick={() => props.dataStore.defaultSource = null} className='fa fa-lock'></i>) :
                    (<i onClick={() => props.dataStore.defaultSource = props.tab.uid} className='fa fa-unlock'></i>)
                  ) : null}
              </span>
              {!props.currentTab ? (
                  <span className='close-button'>
                      <i className='fa fa-times' onClick={(e) => onCloseTab(e, props.tab.tabType, props.tab.uid, props.dataStore)}></i>
                  </span>
              ) : null}
          </div>
      </li>
)));

const CardList = observer((props: {

    dataStore: DataController,
    list: boolean,
    workspace: string,
    id: number,
    compact: boolean}) => {

    return (
      <ul className='card-list'>
            {props.dataStore.tabs.map((tab, index) => {

                // TODO: shouldn't be ==
                const item = props.dataStore.dataStore.all[tab.tabType].value
                    .find((item) => item.uid == tab.uid);

                let url : string | Object | null = null;
                if (tab.tabClass === 'item') {
                  url = `/edit/${AppUrls[tab.tabType]}/${tab.uid}`;
                } else {
                  if (tab.tabClass === 'view') {
                    url = {
                      pathname: `/edit/${AppUrls[tab.tabType]}`,
                      query: tab.query
                    };
                  }
                }

                const subtitle = tab.tabClass === 'item' ?
                  capitalize(AppUrls[tab.tabType]).replace('_', ' ') + ' ' + tab.uid
                  : tab.data;

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
                  dataStore={props.dataStore}
                  compact={props.compact}
                />
              );
        })}
        </ul>
    );
});


interface SidebarProps {
  dataStore?: DataController;
  modalStore?: ModalStore;
  workspace: string;
  list: boolean;
  id: number;
}

interface SidebarState {
    searchString: string;
    compactMode: boolean;
}

@inject('dataStore', 'modalStore')
@observer
export class Sidebar extends React.Component<SidebarProps, SidebarState> {

    constructor() {
        super();
        this.state = {
            searchString: '',
            compactMode: false
        };
    }

    public render() {

        return (
            <section id='sidebar'>

                <SearchBox searchString={this.state.searchString} dataStore={this.props.dataStore!}
                onChange={(evt) => this.setState({searchString: (evt.currentTarget as HTMLInputElement).value})} />

                <div className='sidebar-toolbar'>
                    <button onClick={() => this.props.dataStore!.clearAllTabs()}><i className='fa fa-trash'></i> Clear All</button>
                    <button onClick={() => this.props.modalStore!.addModal({ name: 'createTabSet', cancel: noop, complete: noop, settings: {}})}><i className='fa fa-floppy-o'></i> Save</button>
                    <button onClick={() => this.setState({compactMode: !this.state.compactMode})}><i className='fa fa-compress'></i> Compact</button>
                </div>
                <div className='card-list-container'>

                 <CardList
                    dataStore={this.props.dataStore!}
                    list={this.props.list}
                    workspace={this.props.workspace}
                    id={this.props.id}
                    compact={this.state.compactMode}

                  />
                </div>
            </section>
        );
    }
}

