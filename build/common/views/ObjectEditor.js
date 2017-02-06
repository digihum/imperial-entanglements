/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var Sidebar_1 = require("../components/Sidebar");
var Workspace_1 = require("../components/Workspace");
var Toast_1 = require("../components/Toast");
var DataController_1 = require("../stores/DataController");
var ModalStore_1 = require("../stores/ModalStore");
var react_sortable_hoc_1 = require("react-sortable-hoc");
var mobx_react_devtools_1 = require("mobx-react-devtools");
var mobx_react_1 = require("mobx-react");
var ObjectEditorCore = react_sortable_hoc_1.SortableContainer(function (props) {
    return (React.createElement("span", { className: 'flex-fill' },
        React.createElement(Sidebar_1.Sidebar, { list: props.list, id: props.id, workspace: props.workspace }),
        React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list }),
        props.splitWorkspace ? (React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list })) : null,
        React.createElement("div", { style: { display: 'none' }, className: 'split-workspace-button-container', onClick: props.toggleSplitWorkspace }, props.splitWorkspace ? (React.createElement("i", { className: 'fa fa-times', title: 'split' })) : (React.createElement("i", { className: 'fa fa-columns', title: 'split' })))));
});
var ModalWrapper = mobx_react_1.inject('modalStore')(mobx_react_1.observer(function (props) { return (React.createElement("span", null, props.modalStore.currentModal)); }));
var ObjectEditor = (function (_super) {
    __extends(ObjectEditor, _super);
    function ObjectEditor(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            dataController: new DataController_1.DataController(props.api),
            modalStore: new ModalStore_1.ModalStore(),
            loadingWheel: true,
            loading: true,
            id: NaN,
            list: false,
            splitWorkspace: false
        };
        return _this;
    }
    ObjectEditor.prototype.componentDidMount = function () {
        this.reload(this.props, false, true);
    };
    ObjectEditor.prototype.componentWillUnmount = function () {
        this.state.dataController.saveTabs();
    };
    ObjectEditor.prototype.componentWillReceiveProps = function (props) {
        this.reload(props);
    };
    ObjectEditor.prototype.reload = function (props, force, initialLoad) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (initialLoad === void 0) { initialLoad = false; }
        var oldId = parseInt(this.props.location.pathname.substr(this.props.pathname.length + 1));
        var newId = parseInt(props.location.pathname.substr(props.pathname.length + 1));
        var workspaceChanged = props.workspace !== this.props.workspace;
        var idChanged = isNaN(oldId) ? !isNaN(newId) : isNaN(newId) ? true : oldId !== newId;
        var queryChanged = props.location.search !== this.props.location.search;
        var newWorkspace = props.workspace;
        // if there is not a tab for the current URL - create it
        // if the url is invalid, relocate to /edit/notfound
        if (['entity', 'source', 'predicate', 'entity_type', 'notfound'].indexOf(newWorkspace) === -1) {
            this.context.router.transitionTo('/edit/notfound');
        }
        var alreadyLoaded = newWorkspace === 'notfound' || this.state.dataController.enterPage(newWorkspace, newId, this.props.location.query);
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
            }, function () {
                _this.state.dataController.update()
                    .then(function (dataStore) {
                    _this.setState({
                        loading: false,
                        loadingWheel: false
                    });
                }).catch(function () {
                    _this.context.router.transitionTo('/edit/notfound');
                });
            });
        }
    };
    ObjectEditor.prototype.render = function () {
        var _this = this;
        return (React.createElement(mobx_react_1.Provider, { dataStore: this.state.dataController, modalStore: this.state.modalStore },
            React.createElement("section", { id: 'entity-editor', className: 'flex-fill' },
                process.env.NODE_ENV === 'dev' ? (React.createElement(mobx_react_devtools_1.default, null)) : null,
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }),
                React.createElement("span", { className: 'flex-fill' },
                    React.createElement(ObjectEditorCore, { id: this.state.id, workspace: this.props.workspace, useDragHandle: true, loadingWheel: this.state.loadingWheel, splitWorkspace: this.state.splitWorkspace, helperClass: 'card-being-dragged', toggleSplitWorkspace: function () { return _this.setState({ splitWorkspace: !_this.state.splitWorkspace }); }, list: this.state.list, location: this.props.location, onSortEnd: function (change) { return _this.state.dataController.reorderTabs(change); } }),
                    React.createElement(Toast_1.Toast, null),
                    React.createElement(ModalWrapper, null)),
                React.createElement("span", { className: 'header-colour ' + this.props.workspace }))));
    };
    return ObjectEditor;
}(React.Component));
ObjectEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.ObjectEditor = ObjectEditor;
//# sourceMappingURL=ObjectEditor.js.map