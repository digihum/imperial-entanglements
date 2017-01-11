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

import { find, tail, cloneDeep, findIndex } from 'lodash';

import { DataController } from '../stores/DataController';
import { ModalStore } from '../stores/ModalStore';

import { SortableContainer, arrayMove } from 'react-sortable-hoc';

import DevTools from 'mobx-react-devtools';

import { observable } from 'mobx';
import { Provider } from 'mobx-react';

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

    dataController: DataController;
    modalStore: ModalStore;

    loading: boolean;
    loadingWheel: boolean;

    id: number;
    list: boolean;

    splitWorkspace: boolean;
}

const ObjectEditorCore = SortableContainer((props: {
  id: number,
  workspace: string,
  list: boolean,
  loadingWheel: boolean,
  splitWorkspace: boolean,
  toggleSplitWorkspace: () => void,
  location: { pathname: string, search: string }
}) => {
  return (
    <span className='flex-fill'>
      <Sidebar
        list={props.list}
        id={props.id}
        workspace={props.workspace}
    />

    <Workspace
      workspace={props.workspace}
      id={props.id}
      loading={props.loadingWheel}
      location={props.location}
      list={props.list} />

    {props.splitWorkspace ? (
       <Workspace
        workspace={props.workspace}
        id={props.id}
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

    constructor(props: EntityEditorProps, context: any) {
        super();

        this.state = {
            dataController: new DataController(props.api),
            modalStore: new ModalStore(),
            loadingWheel: true,
            loading: true,
            id: NaN,
            list: false,
            splitWorkspace: false
        };
    }

    public componentDidMount() {
        this.reload(this.props, false, true);
    }

    public componentWillUnmount() {
        this.state.dataController.saveTabs();
    }

    public componentWillReceiveProps(props: EntityEditorProps) {
        this.reload(props);
    }

    public reload(props: EntityEditorProps, force: boolean = false, initialLoad : boolean = false) {

      const oldId = parseInt(this.props.location.pathname.substr(this.props.pathname.length + 1));
      const newId = parseInt(props.location.pathname.substr(props.pathname.length + 1));

      const workspaceChanged = props.workspace !== this.props.workspace;
      const idChanged = isNaN(oldId) ? !isNaN(newId) : isNaN(newId) ? true : oldId !== newId;
      const queryChanged = props.location.search !== this.props.location.search;

      const newWorkspace = props.workspace;

      // if there is not a tab for the current URL - create it
      // if the url is invalid, relocate to /edit/notfound
      if (['entity', 'source', 'predicate', 'entity_type', 'notfound'].indexOf(newWorkspace) === -1) {
        this.context.router.transitionTo('/edit/notfound');
      }

      this.state.dataController.enterPage(newWorkspace, newId, {});

      // this state always updates
      this.setState({
        id: newId,
        list: props.location.pathname.substr(props.pathname.length + 1).length === 0
      }, () => {
         if (!initialLoad && this.state.loading && !force) {
            return;
        }

        this.setState({
          loading: true,
          loadingWheel: initialLoad
        }, () => {

          this.state.dataController.update()
          .then((dataStore) => {
            this.setState({
              loading: false,
              loadingWheel: false
            });
          });
        });
      });
    }

    public render() {
        return (
          <Provider dataStore={this.state.dataController} modalStore={this.state.modalStore}>
            <section id='entity-editor' className='flex-fill'>
              <DevTools />
                <span className={'header-colour ' + this.props.workspace}></span>
                    <span className='flex-fill'>
                      <ObjectEditorCore
                        id={this.state.id}
                        workspace={this.props.workspace}
                        useDragHandle={true}
                        loadingWheel={this.state.loadingWheel}
                        splitWorkspace={this.state.splitWorkspace}
                        helperClass={'card-being-dragged'}
                        toggleSplitWorkspace={() => this.setState({ splitWorkspace: !this.state.splitWorkspace})}
                        list={this.state.list}
                        location={this.props.location}
                       />

                    <Toast />

                    { this.state.modalStore.currentModal() }
                </span>
                <span className={'header-colour ' + this.props.workspace}></span>
            </section>
            </Provider>
        );
    }
}
