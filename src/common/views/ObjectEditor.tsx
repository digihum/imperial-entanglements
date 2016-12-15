/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { ApiService } from '../ApiService';

import { Sidebar, Tab } from '../components/Sidebar';
import { Workspace } from '../components/Workspace';
import { Toast } from '../components/Toast';

import { createTab, closeTab, showModal, triggerReload } from '../Signaller';
import { find, tail, cloneDeep, findIndex } from 'lodash';

import { CreatePredicate } from '../components/modal/CreatePredicate';
import { CreateRecord } from '../components/modal/CreateRecord';
import { CreatePresetRecord } from '../components/modal/CreatePresetRecord';
import { CreateSource } from '../components/modal/CreateSource';
import { CreateEntity } from '../components/modal/CreateEntity';
import { CreateEntityType } from '../components/modal/CreateEntityType';
import { ConflictResolution } from '../components/modal/ConflictResolution';

import { ModalDefinition } from '../components/modal/ModalDefinition';

import { DataStore, emptyDataStore } from '../DataStore';

import { DataController } from '../DataController';

import { SortableContainer, arrayMove } from 'react-sortable-hoc';

interface ExpectedParams {
    id: string;
}

interface EntityEditorProps {
    api: ApiService;
    params: ExpectedParams;
    workspace: string;
    location: { pathname: string, search: string };
    pathname: string;
}

interface EntityEditorState {
    tabs: Tab[];
    inBrowser: boolean;
    modalQueue: ModalDefinition[];
    dataStore: DataStore;
    loading: boolean;
    loadingWheel: boolean;

    id: number;
    list: boolean;

    splitWorkspace: boolean;
}

const ObjectEditorCore = SortableContainer((props: {
  tabs: Tab[],
  api: ApiService,
  dataStore: DataStore,
  id: number,
  workspace: string,
  list: boolean,
  loadingWheel: boolean,
  splitWorkspace: boolean,
  clearTabs: () => void,
  toggleSplitWorkspace: () => void,
  location: { pathname: string, search: string }
}) => {
  return (
    <span className='flex-fill'>
      <Sidebar
        tabs={props.tabs}
        dataStore={props.dataStore}
        clearTabs={props.clearTabs}
        list={props.list}
        id={props.id}
        workspace={props.workspace}
    />

    <Workspace
      api={props.api}
      workspace={props.workspace}
      id={props.id}
      dataStore={props.dataStore}
      loading={props.loadingWheel}
      location={props.location}
      list={props.list} />

    {props.splitWorkspace ? (
       <Workspace
        api={props.api}
        workspace={props.workspace}
        id={props.id}
        dataStore={props.dataStore}
        loading={props.loadingWheel}
        location={props.location}
        list={props.list} />
    ) : null}

    <div className='split-workspace-button-container'
        onClick={props.toggleSplitWorkspace}>
      {props.splitWorkspace ? (
        <i className='fa fa-times' title='split'></i>
      ) : (
        <i className='fa fa-columns' title='split'></i>
      )}
    </div>
  </span>
  );
});

export class ObjectEditor extends React.Component<EntityEditorProps, EntityEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    private boundCreateTab: any;
    private boundCloseTab: any;
    private boundAddModal: any;
    private boundReload: any;

    constructor(props: EntityEditorProps, context: any) {
        super();

        let tabs : Tab[] = [];

        if (typeof window !== 'undefined') {
          const tabString = window.localStorage.getItem('open_tabs');
          if (tabString !== null) {
            tabs = JSON.parse(tabString);
          }
        }

        this.state = {
            tabs,
            inBrowser: (typeof window !== 'undefined'),
            modalQueue: [],
            dataStore: cloneDeep(emptyDataStore),
            loadingWheel: true,
            loading: true,
            id: NaN,
            list: false,
            splitWorkspace: false
        };

        this.boundCreateTab = this.createTab.bind(this);
        this.boundCloseTab = this.closeTab.bind(this);
        this.boundAddModal = this.addModal.bind(this);
        this.boundReload = this.callReload.bind(this);

        createTab.add(this.boundCreateTab);
        closeTab.add(this.boundCloseTab);
        showModal.add(this.boundAddModal);
        triggerReload.add(this.boundReload);
    }

    public componentDidMount() {
        this.reload(this.props, false, true);
    }

    public callReload() {
        this.reload(this.props, true);
    }

    public reload(props: EntityEditorProps, force: boolean = false, initialLoad : boolean = false) {

      const oldId = parseInt(this.props.location.pathname.substr(this.props.pathname.length + 1));
      const newId = parseInt(props.location.pathname.substr(props.pathname.length + 1));

      const workspaceChanged = props.workspace !== this.props.workspace;
      const idChanged = isNaN(oldId) ? !isNaN(newId) : isNaN(newId) ? true : oldId !== newId;
      const queryChanged = props.location.search !== this.props.location.search;

      const newWorkspace = props.workspace;

      // if we are in the browser, load tabs!

      // if there is not a tab for the current URL - create it
      // if the url is invalid, relocate to /edit/notfound
      if (['entity', 'source', 'predicate', 'entity_type', 'notfound'].indexOf(newWorkspace) === -1) {
        this.context.router.transitionTo('/edit/notfound');
      }

      let updatedTabs = this.state.tabs;
      const isList = isNaN(newId);

       if (this.state.inBrowser) {
         if (isList) {
          //  if (
          //    find(updatedTabs, (tab) => tab.tabType === newWorkspace && tab.tabClass == 'list') === undefined || // if no list exists, definitely add one
          //     (workspaceChanged && idChanged && !queryChanged)) {
          //      updatedTabs = updatedTabs.concat([{ tabType: newWorkspace, uid: Date.now(), tabClass: 'list'}]);
          //  }
         } else {
            if (
              find(updatedTabs, (tab) => tab.tabType === newWorkspace && tab.uid == newId) === undefined) {
                updatedTabs = updatedTabs.concat([{ tabType: newWorkspace, uid: newId, tabClass: 'item'}]);
          }
         }

      }

      // this state always updates
      this.setState({
        id: newId,
        list: props.location.pathname.substr(props.pathname.length + 1).length === 0,
        tabs: updatedTabs
      }, () => {
         if (!initialLoad && this.state.loading && !force) {
            return;
        }

        this.setState({
          loading: true,
          loadingWheel: initialLoad
        }, () => {

          DataController.reload(props.api, this.state.tabs, force, (failWorkspace, failUid) => {
            if (newWorkspace === failWorkspace && failUid == newId) {
              this.context.router.transitionTo('/edit/notfound');
            }
          })
        .then((dataStore) => {
          this.setState({
            dataStore,
            loading: false,
            loadingWheel: false
          });
        });

        });
      });
    }

    public createTab(tabType: string, uid: number, tabClass: string, data?: any) {
        // don't add a tab if it already exists
        if (find(this.state.tabs, (tab) => tab.tabType === tabType && tab.uid == uid) === undefined) {
            this.setState({
                tabs: [{ tabType, uid, data, tabClass }].concat(this.state.tabs)
            }, () => {
                this.saveTabs();
                this.reload(this.props);
            });
        }
    }

    public updateTab(tabType: string, uid: number, data: any) {
        const tabs = cloneDeep(this.state.tabs);
        const tabId = findIndex(tabs, (tab) => tab.tabType === tabType && tab.uid === uid);
        if (tabId !== -1) {
            tabs[tabId].data = data;
            this.setState({ tabs });
        }
    }

    public closeTab(tabType: string, uid: number) {
        this.setState({
            tabs: this.state.tabs.filter((a) => a.tabType !== tabType || a.uid !== uid)
        }, () => {
            this.saveTabs();
            this.reload(this.props);
        });
    }

    public saveTabs() {
        const tabsString = JSON.stringify(this.state.tabs);
        if (this.state.inBrowser) {
            window.localStorage.setItem('open_tabs', tabsString);
        }
    }

    public clearAllTabs() {
        this.setState({tabs: []}, () => {
            this.saveTabs();
            this.reload(this.props);
        });
    }

    public reorderTabs(data: {newIndex: number, oldIndex: number}) {
      this.setState({tabs: arrayMove(this.state.tabs, data.oldIndex, data.newIndex)}, () => {
        this.saveTabs();
      });
    }

    public addModal(def: ModalDefinition) {
        this.setState({ modalQueue: [def].concat(this.state.modalQueue)});
    }

    public modalComplete(data: any) {
        if (this.state.modalQueue.length === 0) {
            throw new Error('Attempted to complete non-existent modal');
        }
        this.state.modalQueue[0].complete(data);
        if (this.state.modalQueue.length > 0) {
            this.setState({ modalQueue: tail(this.state.modalQueue) });
        }
    }

    public modalCancel() {
        if (this.state.modalQueue.length === 0) {
            throw new Error('Attempted to cancel non-existent modal');
        }
        this.state.modalQueue[0].cancel();
        this.setState({
            modalQueue: []
        });
    }

    public componentWillUnmount() {
        this.saveTabs();
        createTab.remove(this.boundCreateTab);
        closeTab.remove(this.boundCloseTab);
        showModal.remove(this.boundAddModal);
        triggerReload.remove(this.boundReload);
    }

    public componentWillReceiveProps(props: EntityEditorProps) {
        this.reload(props);
    }

    public render() {
        return (
            <section id='entity-editor' className='flex-fill'>
                <span className={'header-colour ' + this.props.workspace}></span>
                    <span className='flex-fill'>
                      <ObjectEditorCore
                        tabs={this.state.tabs}
                        api={this.props.api}
                        dataStore={this.state.dataStore}
                        id={this.state.id}
                        workspace={this.props.workspace}
                        onSortEnd={this.reorderTabs.bind(this)} //TODO
                        useDragHandle={true}
                        loadingWheel={this.state.loadingWheel}
                        splitWorkspace={this.state.splitWorkspace}
                        helperClass={'card-being-dragged'}
                        clearTabs={this.clearAllTabs.bind(this)}
                        toggleSplitWorkspace={() => this.setState({ splitWorkspace: !this.state.splitWorkspace})}
                        list={this.state.list}
                        location={this.props.location}
                       />

                    <Toast />

                    {(() => {
                        if (this.state.modalQueue.length === 0) {
                            return null;
                        }

                        const sharedProps = {
                            api: this.props.api,
                            dataStore: this.state.dataStore,
                            complete: this.modalComplete.bind(this),
                            cancel: this.modalCancel.bind(this)
                        };

                        switch(this.state.modalQueue[0].name) {
                            case 'predicate':
                                return (<CreatePredicate {...sharedProps} {...this.state.modalQueue[0].settings} />);

                            case 'record':
                                return (<CreateRecord {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'preset_record':
                                return (<CreatePresetRecord {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'source':
                                return (<CreateSource {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'entity':
                                return (<CreateEntity {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'entity_type':
                                return (<CreateEntityType {...sharedProps} {...this.state.modalQueue[0].settings}/>);

                            case 'conflict_resolution':
                                return (<ConflictResolution {...sharedProps} {...this.state.modalQueue[0].settings} />);
                        }
                    })()}
                </span>
                <span className={'header-colour ' + this.props.workspace}></span>
            </section>
        );
    }
}
