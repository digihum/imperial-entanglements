/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const Sidebar_1 = require("../components/Sidebar");
const Workspace_1 = require("../components/Workspace");
const Toast_1 = require("../components/Toast");
const DataController_1 = require("../stores/DataController");
const ModalStore_1 = require("../stores/ModalStore");
const react_sortable_hoc_1 = require("react-sortable-hoc");
const mobx_react_devtools_1 = require("mobx-react-devtools");
const mobx_react_1 = require("mobx-react");
const ObjectEditorCore = react_sortable_hoc_1.SortableContainer((props) => {
    return (React.createElement("span", { className: 'flex-fill' },
        React.createElement(Sidebar_1.Sidebar, { list: props.list, id: props.id, workspace: props.workspace }),
        React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list }),
        props.splitWorkspace ? (React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list })) : null,
        React.createElement("div", { style: { display: 'none' }, className: 'split-workspace-button-container', onClick: props.toggleSplitWorkspace }, props.splitWorkspace ? (React.createElement("i", { className: 'fa fa-times', title: 'split' })) : (React.createElement("i", { className: 'fa fa-columns', title: 'split' })))));
});
const ModalWrapper = mobx_react_1.inject('modalStore')(mobx_react_1.observer((props) => (React.createElement("span", null, props.modalStore.currentModal))));
class ObjectEditor extends React.Component {
    constructor(props, context) {
        super();
        this.state = {
            dataController: new DataController_1.DataController(props.api),
            modalStore: new ModalStore_1.ModalStore(),
            loadingWheel: true,
            loading: true,
            id: NaN,
            list: false,
            splitWorkspace: false
        };
    }
    componentDidMount() {
        this.reload(this.props, false, true);
    }
    componentWillUnmount() {
        this.state.dataController.saveTabs();
    }
    componentWillReceiveProps(props) {
        this.reload(props);
    }
    reload(props, force = false, initialLoad = false) {
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
        const alreadyLoaded = newWorkspace === 'notfound' || this.state.dataController.enterPage(newWorkspace, newId, this.props.location.query);
        if (!initialLoad && this.state.loading && !force) {
            this.setState({
                id: newId,
                list: props.location.pathname.substr(props.pathname.length + 1).length === 0
            });
        }
        else {
            this.setState({
                id: newId,
                list: props.location.pathname.substr(props.pathname.length + 1).length === 0,
                loading: true,
                loadingWheel: initialLoad || !alreadyLoaded
            }, () => {
                this.state.dataController.update()
                    .then((dataStore) => {
                    this.setState({
                        loading: false,
                        loadingWheel: false
                    });
                }).catch(() => {
                    this.context.router.transitionTo('/edit/notfound');
                });
            });
        }
    }
    render() {
        return (React.createElement(mobx_react_1.Provider, { dataStore: this.state.dataController, modalStore: this.state.modalStore },
            React.createElement("section", { id: 'entity-editor', className: 'flex-fill' },
                process.env.NODE_ENV === 'dev' ? (React.createElement(mobx_react_devtools_1.default, null)) : null,
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }),
                React.createElement("span", { className: 'flex-fill' },
                    React.createElement(ObjectEditorCore, { id: this.state.id, workspace: this.props.workspace, useDragHandle: true, loadingWheel: this.state.loadingWheel, splitWorkspace: this.state.splitWorkspace, helperClass: 'card-being-dragged', toggleSplitWorkspace: () => this.setState({ splitWorkspace: !this.state.splitWorkspace }), list: this.state.list, location: this.props.location, onSortEnd: (change) => this.state.dataController.reorderTabs(change) }),
                    React.createElement(Toast_1.Toast, null),
                    React.createElement(ModalWrapper, null)),
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }))));
    }
}
ObjectEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.ObjectEditor = ObjectEditor;
//# sourceMappingURL=ObjectEditor.js.map