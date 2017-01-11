/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const react_dom_1 = __webpack_require__(1);
	const react_1 = __webpack_require__(2);
	const FalconApp_1 = __webpack_require__(3);
	const Database_1 = __webpack_require__(79);
	const wrapDatabase_1 = __webpack_require__(82);
	const react_router_1 = __webpack_require__(4);
	const electron = __webpack_require__(99);
	const databaseFile = electron.remote.dialog.showOpenDialog({ properties: ['openFile'], filters: [
	        { name: 'Database Files', extensions: ['sqlite'] }
	    ] });
	if (databaseFile !== undefined) {
	    electron.remote.getCurrentWindow().setTitle(`Imperial Entanglements (${databaseFile[0]})`);
	    const db = new Database_1.Database({
	        client: 'sqlite3',
	        useNullAsDefault: true,
	        connection: {
	            filename: databaseFile[0]
	        },
	        pool: {
	            afterCreate: (conn, cb) => {
	                conn.run('PRAGMA foreign_keys = ON', cb);
	            }
	        }
	    });
	    document.addEventListener('DOMContentLoaded', (event) => {
	        react_dom_1.render(react_1.createElement(FalconApp_1.FalconApp, {
	            api: wrapDatabase_1.wrapDatabase(db, true),
	            environment: 'app',
	            connected: false,
	            router: react_router_1.MemoryRouter,
	            routerSettings: {
	                initialEntries: ['/'],
	                initialIndex: 0
	            }
	        }), document.getElementById('falcon-container'));
	    });
	}
	else {
	    electron.remote.app.quit();
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react-dom");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	//https://react-router.now.sh/Match
	const React = __webpack_require__(2);
	const react_router_1 = __webpack_require__(4);
	const RouteNotFound_1 = __webpack_require__(5);
	const ApiService_1 = __webpack_require__(6);
	const itemTypes_1 = __webpack_require__(7);
	const Admin_1 = __webpack_require__(9);
	const AdminApp_1 = __webpack_require__(11);
	const User_1 = __webpack_require__(12);
	const UserManagement_1 = __webpack_require__(13);
	const AppDownload_1 = __webpack_require__(14);
	const DatabaseUpload_1 = __webpack_require__(15);
	const react_router_2 = __webpack_require__(4);
	const ObjectEditor_1 = __webpack_require__(16);
	class FalconApp extends React.Component {
	    constructor(props) {
	        super();
	        this.state = {
	            user: '',
	            stats: null
	        };
	    }
	    componentDidMount() {
	        if (this.props.environment === 'website' && window !== undefined) {
	            fetch('/admin/currentuser', { credentials: 'same-origin' })
	                .then((response) => response.json())
	                .then((userData) => this.setState({ user: userData.username }));
	        }
	        this.props.api.getStats()
	            .then((stats) => {
	            this.setState({ stats });
	        });
	    }
	    render() {
	        return (React.createElement("div", { id: 'main', className: 'flex-fill' },
	            React.createElement(this.props.router, __assign({}, this.props.routerSettings, { className: 'flex-fill', basename: '/admin' }),
	                React.createElement("div", { className: 'flex-fill', style: { flexDirection: 'column' } },
	                    React.createElement("div", { className: 'header' },
	                        React.createElement(react_router_2.Link, { to: '/', className: 'logo-link' },
	                            React.createElement("div", { className: 'logo' }, "VRE")),
	                        React.createElement(react_router_2.Link, { to: '/', className: 'header-link' }, "Home"),
	                        React.createElement(react_router_2.Link, { accessKey: 's', to: '/edit/' + ApiService_1.AppUrls.source, className: 'header-link source' }, itemTypes_1.itemTypes.source.plural),
	                        React.createElement(react_router_2.Link, { accessKey: 'e', to: '/edit/' + ApiService_1.AppUrls.entity, className: 'header-link entity' }, itemTypes_1.itemTypes.entity.plural),
	                        React.createElement(react_router_2.Link, { accessKey: 'p', to: '/edit/' + ApiService_1.AppUrls.predicate, className: 'header-link predicate' }, itemTypes_1.itemTypes.predicate.plural),
	                        React.createElement(react_router_2.Link, { accessKey: 't', to: '/edit/' + ApiService_1.AppUrls.entity_type, className: 'header-link entity_type' }, itemTypes_1.itemTypes.entity_type.plural),
	                        this.props.environment === 'website' ? (React.createElement("div", { className: 'right-header' },
	                            React.createElement(react_router_2.Link, { to: '/user', className: 'header-link' },
	                                React.createElement("span", { className: 'current-user' }, this.state.user)),
	                            React.createElement("a", { href: '/admin/logout', className: 'header-link' }, "Logout"),
	                            React.createElement("a", { href: '/', className: 'header-link' },
	                                React.createElement("i", { className: 'fa fa-external-link' })))) : null),
	                    this.props.environment === 'website' ? (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: (matchprops) => (React.createElement(Admin_1.Admin, __assign({}, matchprops, { stats: this.state.stats }))) })) : (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: (matchprops) => (React.createElement(AdminApp_1.AdminApp, __assign({}, matchprops, { stats: this.state.stats }))) })),
	                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/user', component: User_1.User }),
	                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/users', component: UserManagement_1.UserManagement }),
	                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/app', component: AppDownload_1.AppDownload }),
	                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/upload', component: DatabaseUpload_1.DatabaseUpload }),
	                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/search', render: (matchprops) => (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: this.props.api }, matchprops, { workspace: 'search' }))) }),
	                    React.createElement(react_router_1.Match, { pattern: '/edit/:workspace', render: (matchprops) => (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: this.props.api }, matchprops, { workspace: matchprops.params.workspace === 'property' ? 'predicate' : matchprops.params.workspace }))) }),
	                    React.createElement(react_router_1.Miss, { component: RouteNotFound_1.RouteNotFound })))));
	    }
	}
	exports.FalconApp = FalconApp;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.RouteNotFound = (props) => (React.createElement("section", null,
	    React.createElement("h1", null,
	        "The page at ",
	        props.url,
	        " does not exist :(")));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const itemTypes_1 = __webpack_require__(7);
	exports.AppUrls = {
	    element_set: itemTypes_1.itemTypes.element_set.machineName,
	    record: itemTypes_1.itemTypes.record.machineName,
	    entity: itemTypes_1.itemTypes.entity.machineName,
	    entity_type: itemTypes_1.itemTypes.entity_type.machineName,
	    predicate: itemTypes_1.itemTypes.predicate.machineName,
	    source: itemTypes_1.itemTypes.source.machineName,
	    source_element: itemTypes_1.itemTypes.source_element.machineName,
	    element: 'element'
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(8);
	const simpleKey = (raw) => {
	    return parseInt(raw[0]);
	};
	exports.itemTypes = {
	    element_set: {
	        machineName: 'element_set',
	        name: 'Element Set',
	        plural: 'Element Sets',
	        workspace: '',
	        buildKey: simpleKey,
	        item: falcon_core_1.ElementSet
	    },
	    element: {
	        machineName: 'element',
	        name: 'Element',
	        plural: 'Elements',
	        workspace: '',
	        buildKey: simpleKey,
	        item: falcon_core_1.Element
	    },
	    record: {
	        machineName: 'record',
	        name: 'Record',
	        plural: 'Records',
	        workspace: '',
	        buildKey: simpleKey,
	        item: falcon_core_1.Record
	    },
	    entity: {
	        machineName: 'entity',
	        name: 'Entity',
	        plural: 'Entities',
	        workspace: 'entity',
	        buildKey: simpleKey,
	        item: falcon_core_1.Entity
	    },
	    entity_type: {
	        machineName: 'entity_type',
	        name: 'Entity Type',
	        plural: 'Entity Types',
	        workspace: 'entity_type',
	        buildKey: simpleKey,
	        item: falcon_core_1.EntityType
	    },
	    predicate: {
	        machineName: 'predicate',
	        name: 'Property',
	        plural: 'Properties',
	        workspace: 'predicate',
	        buildKey: simpleKey,
	        item: falcon_core_1.Predicate
	    },
	    source: {
	        machineName: 'source',
	        name: 'Source',
	        plural: 'Sources',
	        workspace: 'source',
	        buildKey: simpleKey,
	        item: falcon_core_1.Source
	    },
	    source_element: {
	        machineName: 'source_element',
	        name: 'Source Element',
	        plural: 'Source Elements',
	        workspace: '',
	        buildKey: (raw) => ({
	            order: ['source', 'element'],
	            values: {
	                source: parseInt(raw[0]),
	                element: parseInt(raw[1])
	            }
	        }),
	        item: falcon_core_1.SourceElement
	    }
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("falcon-core");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const react_router_1 = __webpack_require__(4);
	const StatsGrid_1 = __webpack_require__(10);
	exports.Admin = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "Welcome to the admin pages"),
	        React.createElement("ul", { className: 'links-list' },
	            React.createElement("li", null,
	                React.createElement(react_router_1.Link, { to: '/users' },
	                    React.createElement("i", { className: 'fa fa-users' }),
	                    " Manage Users")),
	            React.createElement("li", null,
	                React.createElement(react_router_1.Link, { to: '/app' },
	                    React.createElement("i", { className: 'fa fa-download' }),
	                    " Download app")),
	            React.createElement("li", null,
	                React.createElement("a", { href: '/admin/snapshot' },
	                    React.createElement("i", { className: 'fa fa-cloud-download' }),
	                    " Download database snapshot")),
	            React.createElement("li", null,
	                React.createElement(react_router_1.Link, { to: '/upload' },
	                    React.createElement("i", { className: 'fa fa-cloud-upload' }),
	                    " Upload database file")))),
	    props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const react_router_1 = __webpack_require__(4);
	exports.StatsGrid = (props) => {
	    return (React.createElement("section", { className: 'stats-grid' },
	        React.createElement(react_router_1.Link, { to: '/edit/entity' },
	            React.createElement("div", { className: 'entity' },
	                React.createElement("span", { className: 'item-name' }, "Entities"),
	                React.createElement("span", { className: 'item-count' }, props.stats.entity))),
	        React.createElement(react_router_1.Link, { to: '/edit/entity_type' },
	            React.createElement("div", { className: 'entity_type' },
	                React.createElement("span", { className: 'item-name' }, "Entity Types"),
	                React.createElement("span", { className: 'item-count' }, props.stats.entityType))),
	        React.createElement(react_router_1.Link, { to: '/edit/source' },
	            React.createElement("div", { className: 'source' },
	                React.createElement("span", { className: 'item-name' }, "Sources"),
	                React.createElement("span", { className: 'item-count' }, props.stats.source))),
	        React.createElement(react_router_1.Link, { to: '/edit/predicate' },
	            React.createElement("div", { className: 'predicate' },
	                React.createElement("span", { className: 'item-name' }, "Properties"),
	                React.createElement("span", { className: 'item-count' }, props.stats.predicate))),
	        React.createElement("div", { className: 'record' },
	            React.createElement("span", { className: 'item-name' }, "Records"),
	            React.createElement("span", { className: 'item-count' }, props.stats.record))));
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const StatsGrid_1 = __webpack_require__(10);
	exports.AdminApp = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "VRE App"),
	        props.stats !== null ? (React.createElement(StatsGrid_1.StatsGrid, { stats: props.stats })) : null)));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.User = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "This is the user page"))));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.UserManagement = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "This is the user management page"))));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.AppDownload = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "App Download"),
	        React.createElement("p", null, "Use this VRE without an internet connection! Simply download the app for your platform and then" + " " + "download a database snapshot from the main page. When you are ready, use the upload tool to merge" + " " + "your offline copy with the server."),
	        React.createElement("ul", { className: 'links-list' },
	            React.createElement("li", null,
	                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements%20Setup%200.1.1.exe' },
	                    React.createElement("i", { className: 'fa fa-windows' }),
	                    " Windows")),
	            React.createElement("li", null,
	                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/mac/imperial-entanglements-0.1.1.dmg' },
	                    React.createElement("i", { className: 'fa fa-apple' }),
	                    " Mac")),
	            React.createElement("li", null,
	                React.createElement("a", { href: 'https://github.com/digihum/imperial-entanglements-app/raw/master/bin/imperial-entanglements-0.1.1-x86_64.AppImage' },
	                    React.createElement("i", { className: 'fa fa-linux' }),
	                    " Linux"))))));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.DatabaseUpload = (props) => (React.createElement("div", { className: 'page' },
	    React.createElement("section", null,
	        React.createElement("h1", null, "This is the database upload page"),
	        React.createElement("input", { type: 'file', id: 'input', accept: '.sqlite' }),
	        React.createElement("button", { onClick: () => { alert('Work in process'); } }, "Upload"))));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const Sidebar_1 = __webpack_require__(17);
	const Workspace_1 = __webpack_require__(24);
	const Toast_1 = __webpack_require__(64);
	const DataController_1 = __webpack_require__(65);
	const ModalStore_1 = __webpack_require__(69);
	const react_sortable_hoc_1 = __webpack_require__(22);
	const mobx_react_devtools_1 = __webpack_require__(78);
	const mobx_react_1 = __webpack_require__(23);
	const ObjectEditorCore = react_sortable_hoc_1.SortableContainer((props) => {
	    return (React.createElement("span", { className: 'flex-fill' },
	        React.createElement(Sidebar_1.Sidebar, { list: props.list, id: props.id, workspace: props.workspace }),
	        React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list }),
	        props.splitWorkspace ? (React.createElement(Workspace_1.Workspace, { workspace: props.workspace, id: props.id, loading: props.loadingWheel, location: props.location, list: props.list })) : null,
	        React.createElement("div", { className: 'split-workspace-button-container', onClick: props.toggleSplitWorkspace }, props.splitWorkspace ? (React.createElement("i", { className: 'fa fa-times', title: 'split' })) : (React.createElement("i", { className: 'fa fa-columns', title: 'split' })))));
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
	    render() {
	        return (React.createElement(mobx_react_1.Provider, { dataStore: this.state.dataController, modalStore: this.state.modalStore },
	            React.createElement("section", { id: 'entity-editor', className: 'flex-fill' },
	                React.createElement(mobx_react_devtools_1.default, null),
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


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const SearchBox_1 = __webpack_require__(18);
	const ApiService_1 = __webpack_require__(6);
	const react_router_1 = __webpack_require__(4);
	const lodash_1 = __webpack_require__(21);
	const react_sortable_hoc_1 = __webpack_require__(22);
	const mobx_react_1 = __webpack_require__(23);
	const Handle = react_sortable_hoc_1.SortableHandle((props) => (React.createElement("div", { className: 'badge-container' },
	    React.createElement("div", { className: 'badge ' + props.tabType },
	        React.createElement("span", null, props.tabType[0].toUpperCase())))));
	const onCloseTab = (e, tabType, uid, dataStore) => {
	    dataStore.closeTab(tabType, uid);
	    e.stopPropagation();
	    e.preventDefault();
	    e.nativeEvent.stopImmediatePropagation();
	};
	const Card = react_sortable_hoc_1.SortableElement(mobx_react_1.observer((props) => (React.createElement("li", { key: `${props.url}` },
	    React.createElement("div", { className: ((currentTab) => {
	            const classes = ['sidebar-card', props.tab.tabClass];
	            if (currentTab) {
	                classes.push('current');
	            }
	            if (props.compact) {
	                classes.push('compact');
	            }
	            return classes.join(' ');
	        })(props.currentTab) },
	        React.createElement(Handle, { tabType: props.tab.tabType, index: props.index, collection: props.collection, disabled: props.disabled }),
	        React.createElement("div", { className: 'description' },
	            React.createElement(react_router_1.Link, { to: props.url },
	                React.createElement("span", { className: 'entity-name' }, props.title),
	                props.compact ? null : lodash_1.isObject(props.subtitle) ? (React.createElement("ul", null, Object.keys(props.subtitle).map((sub, i) => (React.createElement("li", { key: `tab-${props.index}-${i}` },
	                    sub,
	                    ":",
	                    lodash_1.isObject(props.subtitle[sub]) ? (React.createElement("span", null,
	                        React.createElement("ul", null, Object.keys(props.subtitle[sub]).map((subSub, j) => (React.createElement("li", { key: `tab-${props.index}-${i}-${j}` },
	                            subSub,
	                            ": ",
	                            props.subtitle[sub][subSub])))))) : null))))) : (React.createElement("span", { className: 'entity-type' }, props.subtitle)))),
	        React.createElement("span", { className: 'lock-button' }, props.tab.tabType === 'source' ? (props.dataStore.defaultSource === props.tab.uid ?
	            (React.createElement("i", { onClick: () => props.dataStore.defaultSource = null, className: 'fa fa-lock' })) :
	            (React.createElement("i", { onClick: () => props.dataStore.defaultSource = props.tab.uid, className: 'fa fa-unlock' }))) : null),
	        !props.currentTab ? (React.createElement("span", { className: 'close-button' },
	            React.createElement("i", { className: 'fa fa-times', onClick: (e) => onCloseTab(e, props.tab.tabType, props.tab.uid, props.dataStore) }))) : null)))));
	const CardList = mobx_react_1.observer((props) => {
	    return (React.createElement("ul", { className: 'card-list' }, props.dataStore.tabs.map((tab, index) => {
	        // TODO: shouldn't be ==
	        const item = props.dataStore.dataStore.all[tab.tabType].value
	            .find((item) => item.uid == tab.uid);
	        let url = null;
	        if (tab.tabClass === 'item') {
	            url = `/edit/${ApiService_1.AppUrls[tab.tabType]}/${tab.uid}`;
	        }
	        else {
	            if (tab.tabClass === 'view') {
	                url = {
	                    pathname: `/edit/${ApiService_1.AppUrls[tab.tabType]}`,
	                    query: tab.query
	                };
	            }
	        }
	        const subtitle = tab.tabClass === 'item' ?
	            lodash_1.capitalize(ApiService_1.AppUrls[tab.tabType]).replace('_', ' ') + ' ' + tab.uid
	            : tab.data;
	        const title = item === undefined ? `${tab.tabType} list` : item.label;
	        const currentTab = !props.list && tab.tabType === props.workspace && tab.uid == props.id;
	        return (React.createElement(Card, { key: `tab-${tab.tabType}-${tab.tabClass}-${tab.uid}-${tab.query}`, currentTab: currentTab, url: url, tab: tab, title: title, subtitle: subtitle, index: index, dataStore: props.dataStore, compact: props.compact }));
	    })));
	});
	let Sidebar = class Sidebar extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            searchString: '',
	            compactMode: false
	        };
	    }
	    render() {
	        return (React.createElement("section", { id: 'sidebar' },
	            React.createElement(SearchBox_1.SearchBox, { searchString: this.state.searchString, dataStore: this.props.dataStore, onChange: (evt) => this.setState({ searchString: evt.currentTarget.value }) }),
	            React.createElement("div", { className: 'sidebar-toolbar' },
	                React.createElement("button", { onClick: this.props.dataStore.clearAllTabs },
	                    React.createElement("i", { className: 'fa fa-trash' }),
	                    " Clear All"),
	                React.createElement("button", { onClick: () => this.setState({ compactMode: !this.state.compactMode }) },
	                    React.createElement("i", { className: 'fa fa-compress' }),
	                    " Compact")),
	            React.createElement("div", { className: 'card-list-container' },
	                React.createElement(CardList, { dataStore: this.props.dataStore, list: this.props.list, workspace: this.props.workspace, id: this.props.id, compact: this.state.compactMode }))));
	    }
	};
	Sidebar = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], Sidebar);
	exports.Sidebar = Sidebar;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Searchboc for sidebar
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const ComboDropdown_1 = __webpack_require__(19);
	const ApiService_1 = __webpack_require__(6);
	const lodash_1 = __webpack_require__(21);
	exports.SearchBox = (props, context) => {
	    const entities = props.dataStore.dataStore.all.entity.value.map((entity) => ({ key: entity.label, value: lodash_1.toString(entity.uid), meta: { itemType: ApiService_1.AppUrls.entity } }));
	    const entityTypes = props.dataStore.dataStore.all.entity_type.value.map((entityType) => ({ key: entityType.label, value: lodash_1.toString(entityType.uid), meta: { itemType: ApiService_1.AppUrls.entity_type } }));
	    const predicates = props.dataStore.dataStore.all.predicate.value.map((predicate) => ({ key: predicate.label, value: lodash_1.toString(predicate.uid), meta: { itemType: ApiService_1.AppUrls.predicate } }));
	    const sources = props.dataStore.dataStore.all.source.value.map((source) => ({ key: source.label, value: lodash_1.toString(source.uid), meta: { itemType: ApiService_1.AppUrls.source } }));
	    const all = entities.concat(entityTypes, predicates, sources);
	    return (React.createElement("span", null,
	        React.createElement("div", { className: 'input-addon-formgroup' },
	            React.createElement("span", { className: 'input-addon-icon' },
	                React.createElement("i", { className: 'fa fa-search fa-fw' })),
	            React.createElement(ComboDropdown_1.ComboDropdown, { value: { key: '', value: '' }, setValue: (val) => {
	                    if (val !== null) {
	                        context.router.transitionTo(`/edit/${val.meta.itemType}/${val.value}`);
	                    }
	                }, typeName: 'all', options: all, allowNew: false, createNewValue: () => { } }))));
	};
	exports.SearchBox.contextTypes = { router: React.PropTypes.object.isRequired };


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const lunr = __webpack_require__(20);
	const lodash_1 = __webpack_require__(21);
	class ComboDropdown extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            searchString: '',
	            showingDropDown: false,
	            filteredOptions: [],
	            highlightedIndex: null,
	            dropDownHeight: 0
	        };
	    }
	    componentWillMount() {
	        this.ignoreBlur = false;
	        this.ignoreClick = false;
	        this.recalculateHeight = true;
	        this.dropDownBoxElement = null;
	        this.setState({
	            filteredOptions: this.props.options,
	            searchString: this.props.value === null || this.props.value.key === null ? '' : this.props.value.key
	        });
	    }
	    componentWillReceiveProps(newProps) {
	        let filterString = '';
	        if (this.props.value === null) {
	            if (newProps.value === null) {
	                // change nothing
	                filterString = this.state.searchString;
	            }
	            else {
	                // set to newProps value
	                filterString = newProps.value.key;
	            }
	        }
	        else {
	            if (newProps.value === null) {
	                // set to ''
	                filterString = '';
	            }
	            else {
	                if (newProps.value === this.props.value) {
	                    // change nothing
	                    filterString = this.state.searchString;
	                }
	                else {
	                    // set to newProps value
	                    filterString = newProps.value.key;
	                }
	            }
	        }
	        //const filterString = newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString;
	        this.updateFilter(filterString, newProps);
	        this.setState({
	            searchString: filterString
	        });
	    }
	    changeSearchString(event) {
	        this.setState({
	            searchString: event.target.value,
	            showingDropDown: true
	        }, () => {
	            this.updateFilter(this.state.searchString, this.props);
	            if (this.props.updateSearchString !== undefined) {
	                this.props.updateSearchString(this.state.searchString);
	            }
	        });
	    }
	    updateSearchString(s) {
	        if (this.props.updateSearchString !== undefined) {
	            this.props.updateSearchString(s);
	        }
	    }
	    updateFilter(filter, props) {
	        let filtered = [];
	        if (filter.length > 0) {
	            const idx = lunr(function () {
	                this.field('key', { boost: 10 });
	            });
	            props.options.forEach((opt, i) => idx.add(Object.assign({}, opt, { id: i })));
	            const result = idx.search(filter);
	            for (let i = 0; i < result.length; i += 1) {
	                filtered.push(props.options[result[i].ref]);
	            }
	        }
	        else {
	            filtered = props.options;
	        }
	        if (this.dropDownBoxElement !== null) {
	            this.recalculateHeight = true;
	            this.calculateDropdownHeight(this.dropDownBoxElement);
	        }
	        this.setState({
	            filteredOptions: filtered
	        });
	    }
	    addNewAction(option) {
	        this.props.createNewValue(option);
	    }
	    selectOption(option) {
	        this.props.setValue(option);
	        this.ignoreBlur = false;
	        this.recalculateHeight = true;
	        this.setState({ showingDropDown: false, searchString: option.key });
	        this.updateSearchString(option.key);
	    }
	    handleInputBlur() {
	        if (!this.ignoreBlur) {
	            if (this.state.searchString.length === 0) {
	                this.setState({ searchString: '' });
	            }
	            else {
	                if (lodash_1.findIndex(this.props.options, (option) => option.key === this.state.searchString) === -1) {
	                    this.setState({ searchString: this.props.value === null ? '' : this.props.value.key }, () => {
	                        this.updateFilter(this.props.value === null ? '' : this.props.value.key, this.props);
	                    });
	                }
	            }
	            this.recalculateHeight = true;
	            this.setState({
	                showingDropDown: false
	            });
	        }
	    }
	    handleInputFocus() {
	        if (this.ignoreBlur) {
	            this.ignoreBlur = true;
	            return;
	        }
	        // We don't want `selectItemFromMouse` to trigger when
	        // the user clicks into the input to focus it, so set this
	        // flag to cancel out the logic in `handleInputClick`.
	        // The event order is:  MouseDown -> Focus -> MouseUp -> Click
	        this.ignoreClick = true;
	        this.setState({ showingDropDown: true });
	    }
	    handleInputClick() {
	        // Input will not be focused if it's disabled
	        if (this.isInputFocused() && this.state.showingDropDown === false) {
	            this.setState({ showingDropDown: true });
	        }
	        else {
	            if (this.state.highlightedIndex !== null && !this.ignoreClick) {
	                this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
	            }
	            else {
	                this.ignoreClick = false;
	            }
	        }
	    }
	    selectItemFromMouse(item) {
	        this.recalculateHeight = true;
	        this.setState({
	            showingDropDown: false,
	            highlightedIndex: null
	        }, () => {
	            this.props.setValue(item);
	            this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
	        });
	    }
	    isInputFocused() {
	        const el = this.refs[ComboDropdown.comboDropdownInputBoxRef];
	        return el.ownerDocument && (el === el.ownerDocument.activeElement);
	    }
	    clearSearchBox() {
	        this.props.setValue(null);
	        this.setState({ searchString: '' });
	        this.refs[ComboDropdown.comboDropdownInputBoxRef].focus();
	    }
	    calculateDropdownHeight(val) {
	        this.dropDownBoxElement = val;
	        if (val === null || !this.recalculateHeight) {
	            return;
	        }
	        else {
	            this.setState({
	                dropDownHeight: window.document.body.getBoundingClientRect().bottom - val.getBoundingClientRect().top - 32
	            });
	            this.recalculateHeight = false;
	        }
	    }
	    render() {
	        return (React.createElement("div", { className: this.props.compact ? 'compact combo-dropdown' : 'combo-dropdown' },
	            React.createElement("div", null,
	                React.createElement("input", { type: 'text', ref: ComboDropdown.comboDropdownInputBoxRef, className: 'search-input', value: this.state.searchString, placeholder: 'Click here and start typing..', onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onChange: this.changeSearchString.bind(this), onClick: this.handleInputClick.bind(this) }),
	                this.state.searchString.length > 0 ? (React.createElement("i", { className: 'fa fa-times clear-button', onClick: this.clearSearchBox.bind(this) })) : null),
	            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown', style: { maxHeight: this.state.dropDownHeight, overflowY: 'auto' }, ref: this.calculateDropdownHeight.bind(this) },
	                React.createElement("ul", null,
	                    this.state.searchString.length === 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: () => this.ignoreBlur = true, onClick: () => this.addNewAction('') },
	                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
	                        "Add new ",
	                        this.props.typeName)) : null,
	                    this.state.filteredOptions.map((opt, i) => (React.createElement("li", { key: `opt-${opt.key}-${i}`, onMouseDown: () => this.ignoreBlur = true, onClick: () => this.selectOption(opt) }, opt.key))),
	                    this.state.searchString.length > 0 && this.props.allowNew ? (React.createElement("li", { className: 'add', onMouseDown: () => this.ignoreBlur = true, onClick: () => this.addNewAction(this.state.searchString) },
	                        React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
	                        "Add new ",
	                        this.props.typeName,
	                        ": '",
	                        this.state.searchString,
	                        "'")) : null))) : null));
	    }
	}
	ComboDropdown.defaultProps = {
	    allowNew: true,
	    compact: false,
	    updateSearchString: lodash_1.noop
	};
	ComboDropdown.comboDropdownInputBoxRef = 'comboDropDownInputBox';
	exports.ComboDropdown = ComboDropdown;


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("lunr");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("react-sortable-hoc");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("mobx-react");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Loading_1 = __webpack_require__(25);
	const mobx_react_1 = __webpack_require__(23);
	const workspace_1 = __webpack_require__(26);
	let Workspace = class Workspace extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            searchString: ''
	        };
	    }
	    render() {
	        if (this.props.loading) {
	            return (React.createElement(Loading_1.Loading, null));
	        }
	        if (this.props.list) {
	            return (React.createElement(workspace_1.ObjectListWorkspace, { name: this.props.name, query: this.props.location.query, listType: this.props.workspace }));
	        }
	        let workspaceComponent = workspace_1.EmptyWorkspace;
	        switch (this.props.workspace) {
	            case 'entity':
	                workspaceComponent = workspace_1.EntityEditorWorkspace;
	                break;
	            case 'predicate':
	                workspaceComponent = workspace_1.PredicateEditorWorkspace;
	                break;
	            case 'source':
	                workspaceComponent = workspace_1.SourceEditorWorkspace;
	                break;
	            case 'entity_type':
	                workspaceComponent = workspace_1.EntityTypeWorkspace;
	                break;
	            case 'search':
	                workspaceComponent = workspace_1.AdvancedSearchWorkspace;
	                break;
	        }
	        return (React.createElement("div", { className: 'flex-fill workspace-outer-wrapper' },
	            React.createElement("div", { className: 'workspace-inner-wrapper flex-fill' }, React.createElement(workspaceComponent, { id: this.props.id }))));
	    }
	};
	Workspace = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], Workspace);
	exports.Workspace = Workspace;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.Loading = (props) => {
	    return (React.createElement("div", { className: 'loader-wrapper' },
	        React.createElement("div", { className: 'loader' })));
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Unified export of workspaces
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk" />Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var EmptyWorkspace_1 = __webpack_require__(27);
	exports.EmptyWorkspace = EmptyWorkspace_1.EmptyWorkspace;
	var EntityEditorWorkspace_1 = __webpack_require__(28);
	exports.EntityEditorWorkspace = EntityEditorWorkspace_1.EntityEditorWorkspace;
	var EntityTypeWorkspace_1 = __webpack_require__(48);
	exports.EntityTypeWorkspace = EntityTypeWorkspace_1.EntityTypeWorkspace;
	var SourceEditorWorkspace_1 = __webpack_require__(52);
	exports.SourceEditorWorkspace = SourceEditorWorkspace_1.SourceEditorWorkspace;
	var PredicateEditorWorkspace_1 = __webpack_require__(53);
	exports.PredicateEditorWorkspace = PredicateEditorWorkspace_1.PredicateEditorWorkspace;
	var AdvancedSearchWorkspace_1 = __webpack_require__(56);
	exports.AdvancedSearchWorkspace = AdvancedSearchWorkspace_1.AdvancedSearchWorkspace;
	var ObjectListWorkspace_1 = __webpack_require__(57);
	exports.ObjectListWorkspace = ObjectListWorkspace_1.ObjectListWorkspace;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.EmptyWorkspace = () => (React.createElement("div", { className: 'workspace-editor' },
	    React.createElement("h2", null, "There is nothing here")));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const lodash_1 = __webpack_require__(21);
	const findParentTree_1 = __webpack_require__(29);
	const EditableHeader_1 = __webpack_require__(30);
	const EntityWorkspaceCoreView_1 = __webpack_require__(32);
	const EntityWorkspaceReferenceView_1 = __webpack_require__(47);
	const mobx_react_1 = __webpack_require__(23);
	class StringEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	class ComboEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	// What can I do?
	// Entity Operations
	// - Delete the entity
	// - Merge the entity
	// - Split the entity
	// - Add 'same-as-ses' to the entity
	// Records
	// - Order records by type, source and date
	// - Add new records
	// - Adding a new predicate creates a new record with the
	//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
	//   it also creates a blank entry in the records sub table based on the range of the predicate.
	// - New predicates must have a name. The domain is set to the current entitytype but can be changed
	//   to one of its parents. The range MUST be set.
	// Visualisations:
	// - Network graph of entity relationships
	let EntityEditorWorkspace = class EntityEditorWorkspace extends React.Component {
	    constructor(props, context) {
	        super();
	        this.state = {
	            comboValue: { key: 'test', value: '' },
	            comboSearchValue: '',
	            tab: 0
	        };
	    }
	    del() {
	        this.props.dataStore.delItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id)
	            .then(() => {
	            this.props.dataStore.closeTab('entity', this.props.id);
	            this.context.router.transitionTo('/edit/notfound');
	        })
	            .catch((e) => {
	            e.data.then((data) => {
	                const conflictResolutionModal = {
	                    name: 'conflict_resolution',
	                    cancel: () => { },
	                    complete: (result) => {
	                        if (result === 'addToWorkspace') {
	                            data.record.forEach((datum) => {
	                                this.props.dataStore.createTab('entity', datum.entity, 'item');
	                            });
	                            data.entity.forEach((datum) => {
	                                this.props.dataStore.createTab('entity', datum.uid, 'item');
	                            });
	                        }
	                        if (result === 'deleteAll') {
	                            Promise.all(data.record.map((datum) => this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid)))
	                                .then(() => {
	                                this.del();
	                            });
	                        }
	                    },
	                    settings: {
	                        conflictingItems: data,
	                        message: 'Deleting Entity'
	                    }
	                };
	                this.props.modalStore.addModal(conflictResolutionModal);
	            });
	        });
	    }
	    createNewRecord() {
	        const entity = this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;
	        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
	        const entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
	        const predicates = this.props.dataStore.dataStore.all.predicate
	            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);
	        const modalDef = {
	            name: 'record',
	            complete: (data) => {
	                console.log('Records editor called complete');
	                //this.loadData(this.props);
	            },
	            cancel: () => {
	                console.log('Records editor called cancel');
	            },
	            settings: {
	                options: predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred })),
	                entityUid: this.props.id,
	                entityType: entityType.uid
	            }
	        };
	        this.props.modalStore.addModal(modalDef);
	    }
	    update(data) {
	        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
	    }
	    clone() {
	        const entity = this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;
	        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
	            label: 'Copy of ' + entity.label,
	            entityType: entity.entityType
	        })).then(([id]) => this.props.dataStore.createTab('entity', id, 'item'));
	    }
	    render() {
	        const entity = this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;
	        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
	        const potentialParents = this.props.dataStore.dataStore.all.entity.value;
	        const entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
	        const predicates = this.props.dataStore.dataStore.all.predicate
	            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);
	        const sources = this.props.dataStore.dataStore.all.source.value;
	        const records = lodash_1.groupBy(this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.records, 'predicate');
	        const options = predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred }));
	        let parentName = '';
	        if (potentialParents !== null && entity.parent !== undefined) {
	            const found = potentialParents.find((par) => par.uid === entity.parent);
	            if (found !== undefined) {
	                parentName = found.label;
	            }
	        }
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header entity' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("i", { className: 'fa fa-cube item-icon' }),
	                        React.createElement(StringEditableFieldComponent, { value: entity.label, component: EditableHeader_1.EditableHeader, onChange: (value) => this.update({ 'label': value }) })),
	                    React.createElement("div", { className: 'sub-toolbar' },
	                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
	                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.clone.bind(this) }))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'entity ' + (this.state.tab === 0 ? 'selected' : ''), onClick: () => this.setState({ tab: 0 }) }, "CORE"),
	                        React.createElement("div", { className: 'entity ' + (this.state.tab === 1 ? 'selected' : ''), onClick: () => this.setState({ tab: 1 }) }, "REFERENCED BY")))),
	            this.state.tab === 0 ? (React.createElement(EntityWorkspaceCoreView_1.EntityWorkspaceCoreView, { dataStore: this.props.dataStore, id: this.props.id })) : (React.createElement(EntityWorkspaceReferenceView_1.EntityWorkspaceReferenceView, { dataStore: this.props.dataStore, id: this.props.id }))));
	    }
	};
	EntityEditorWorkspace.contextTypes = {
	    router: React.PropTypes.object.isRequired,
	    manager: React.PropTypes.object.isRequired
	};
	EntityEditorWorkspace = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [Object, Object])
	], EntityEditorWorkspace);
	exports.EntityEditorWorkspace = EntityEditorWorkspace;


/***/ },
/* 29 */
/***/ function(module, exports) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	exports.findParentTree = (uid, data, ancestors = []) => {
	    const current = data.find((datum) => datum.uid === uid);
	    if (current === undefined) {
	        console.warn('Couldn\'t find parent');
	        return ancestors;
	    }
	    else {
	        if (current.parent === null || current.uid === null) {
	            if (current.uid === null) {
	                console.warn('Found entity will null uid');
	                return ancestors;
	            }
	            else {
	                return ancestors.concat([current.uid]);
	            }
	        }
	        else {
	            return exports.findParentTree(current.parent, data, ancestors.concat([current.uid]));
	        }
	    }
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	var EditableFieldComponent_1 = __webpack_require__(31);
	exports.EditableFieldComponent = EditableFieldComponent_1.EditableFieldComponent;
	exports.EditableHeader = (props) => {
	    if (!props.edit || props.value == null) {
	        return (React.createElement("h2", null,
	            props.value,
	            React.createElement("sup", null,
	                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
	    }
	    else {
	        return (React.createElement("span", null,
	            React.createElement("input", { type: 'text', value: props.value, className: 'text-edit-header', onChange: (e) => props.onChange(e.target.value) }),
	            React.createElement("button", { onClick: props.acceptChanges },
	                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
	            React.createElement("button", { onClick: props.cancelChanges },
	                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
	    }
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	const React = __webpack_require__(2);
	class EditableFieldComponent extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            edit: false,
	            internalValue: null
	        };
	    }
	    componentWillMount() {
	        this.setState({ internalValue: this.props.value === undefined ? null : this.props.value });
	    }
	    componentWillReceiveProps(newProps) {
	        this.setState({ internalValue: newProps.value });
	    }
	    switchToEditState() {
	        this.setState({ edit: true, internalValue: this.props.value });
	    }
	    setInternalValue(internalValue) {
	        this.setState({ internalValue });
	    }
	    acceptChanges() {
	        this.props.onChange(this.state.internalValue);
	        this.setState({ edit: false });
	    }
	    cancelChanges() {
	        this.setState({ edit: false, internalValue: this.props.value });
	    }
	    render() {
	        return (React.createElement(this.props.component, __assign({ edit: this.state.edit, value: this.state.internalValue, onChange: this.setInternalValue.bind(this), setEdit: this.switchToEditState.bind(this), acceptChanges: this.acceptChanges.bind(this), cancelChanges: this.cancelChanges.bind(this), onDelete: (e) => this.props.onDelete !== undefined ? this.props.onDelete(this.props.value) : null }, this.props.additionalProps)));
	    }
	}
	exports.EditableFieldComponent = EditableFieldComponent;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const RecordsEditor_1 = __webpack_require__(33);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const lodash_1 = __webpack_require__(21);
	const AddTabButton_1 = __webpack_require__(45);
	const findParentTree_1 = __webpack_require__(29);
	const EditableHeader_1 = __webpack_require__(30);
	const EditableComboDropdown_1 = __webpack_require__(46);
	class StringEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	class ComboEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	// What can I do?
	// Entity Operations
	// - Delete the entity
	// - Merge the entity
	// - Split the entity
	// - Add 'same-as-ses' to the entity
	// Records
	// - Order records by type, source and date
	// - Add new records
	// - Adding a new predicate creates a new record with the
	//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
	//   it also creates a blank entry in the records sub table based on the range of the predicate.
	// - New predicates must have a name. The domain is set to the current entitytype but can be changed
	//   to one of its parents. The range MUST be set.
	// Visualisations:
	// - Network graph of entity relationships
	class EntityWorkspaceCoreView extends React.Component {
	    constructor(props, context) {
	        super();
	        this.state = {
	            comboValue: { key: 'test', value: '' },
	            comboSearchValue: ''
	        };
	    }
	    update(data) {
	        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
	    }
	    render() {
	        const entity = this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;
	        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
	        const potentialParents = this.props.dataStore.dataStore.all.entity.value;
	        const entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
	        const predicates = this.props.dataStore.dataStore.all.predicate
	            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);
	        const sources = this.props.dataStore.dataStore.all.source.value;
	        const records = lodash_1.groupBy(this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.records, 'predicate');
	        const options = predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred }));
	        let parentName = '';
	        if (potentialParents !== null && entity.parent !== undefined) {
	            const found = potentialParents.find((par) => par.uid === entity.parent);
	            if (found !== undefined) {
	                parentName = found.label;
	            }
	        }
	        return (React.createElement("section", { className: 'editor-body' },
	            React.createElement("div", { className: 'flex-fill' },
	                React.createElement("div", { className: 'flex-fill' },
	                    React.createElement("div", null,
	                        React.createElement("label", { className: 'small' }, "Type"),
	                        entityType.label,
	                        " ",
	                        React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' }))),
	                React.createElement("div", { style: { flex: 1 } },
	                    React.createElement("label", { className: 'small' }, "Parent"),
	                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: entity.parent }, component: EditableComboDropdown_1.EditableComboDropdown, onChange: (value) => this.update({ 'parent': value.value }), additionalProps: { comboSettings: {
	                                options: potentialParents.map((par) => ({ key: par.label, value: par.uid })),
	                                typeName: 'Entity'
	                            } } }),
	                    entity.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: entity.parent })) : null)),
	            React.createElement("div", { className: 'edit-group' },
	                React.createElement(RecordsEditor_1.RecordsEditor, { dimension: 'predicates', entityExists: true, id: this.props.id, records: records, onChange: () => { }, predicates: predicates, sources: sources, entityTypeId: entityType.uid }))));
	    }
	}
	EntityWorkspaceCoreView.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	exports.EntityWorkspaceCoreView = EntityWorkspaceCoreView;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const EditableFieldComponent_1 = __webpack_require__(31);
	const SearchBar_1 = __webpack_require__(34);
	const RecordPredicate_1 = __webpack_require__(35);
	const findParentTree_1 = __webpack_require__(29);
	const mobx_react_1 = __webpack_require__(23);
	class RecordEditableFieldComponent extends EditableFieldComponent_1.EditableFieldComponent {
	}
	let RecordsEditor = class RecordsEditor extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            filterFunc: () => true
	        };
	    }
	    deleteRecord(record) {
	        if (record.uid === null) {
	            throw new Error('Trying to delete a record with null id');
	        }
	        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
	            .then(() => {
	            this.props.onChange();
	        });
	    }
	    createNewRecord() {
	        const entity = this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.entity;
	        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
	        const entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
	        const predicates = this.props.dataStore.dataStore.all.predicate
	            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);
	        const modalDef = {
	            name: 'record',
	            complete: (data) => {
	                console.log('Records editor called complete');
	                //this.loadData(this.props);
	            },
	            cancel: () => {
	                console.log('Records editor called cancel');
	            },
	            settings: {
	                options: predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred })),
	                entityUid: this.props.id,
	                entityType: this.props.entityTypeId
	            }
	        };
	        this.props.modalStore.addModal(modalDef);
	    }
	    render() {
	        const predicates = this.props.predicates;
	        return (React.createElement("div", null,
	            React.createElement("div", null,
	                React.createElement("div", null,
	                    React.createElement("label", { className: 'small' }, "Records"),
	                    React.createElement("div", { style: { display: 'flex' } },
	                        React.createElement("div", { style: { flex: '1' } },
	                            React.createElement(SearchBar_1.SearchBar, { getValue: (p) => p.label, setFilterFunc: (filterFunc) => this.setState({ filterFunc }) })),
	                        React.createElement("div", { style: { padding: '0.1em 0.4em', fontSize: '2em' } },
	                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: 'Add new record' }))),
	                    React.createElement("div", null, Object.keys(this.props.records).map((section) => {
	                        const currentPredicate = predicates.find((pred) => {
	                            if (pred.uid === null) {
	                                throw new Error('encountered predicate with null id');
	                            }
	                            return pred.uid.toString() === section;
	                        });
	                        if (currentPredicate === undefined) {
	                            throw new Error('Could not find predicate');
	                        }
	                        if (!this.state.filterFunc(currentPredicate)) {
	                            return null;
	                        }
	                        return (React.createElement(RecordPredicate_1.RecordPredicate, { key: `section-${section}`, entity_id: this.props.id, dataStore: this.props.dataStore, dimension: 'predicate', records: this.props.records[section], predicate: currentPredicate, sources: this.props.sources, onChange: this.props.onChange }));
	                    }))))));
	    }
	};
	RecordsEditor = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], RecordsEditor);
	exports.RecordsEditor = RecordsEditor;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.SearchBar = (props) => {
	    const filterFunc = (s) => {
	        return (a) => {
	            if (s.length === 0) {
	                return true;
	            }
	            return props.getValue(a).toLowerCase().indexOf(s.toLowerCase()) !== -1;
	        };
	    };
	    return (React.createElement("div", null,
	        React.createElement("div", { className: 'input-addon-formgroup' },
	            React.createElement("span", { className: 'input-addon-icon' },
	                React.createElement("i", { className: 'fa fa-search fa-fw' })),
	            React.createElement("input", { type: 'text', className: 'form-control with-addon', onChange: (e) => props.setFilterFunc(filterFunc(e.target.value)) }))));
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const EditableFieldComponent_1 = __webpack_require__(31);
	const RecordRow_1 = __webpack_require__(36);
	const AddTabButton_1 = __webpack_require__(45);
	class RecordEditableFieldComponent extends EditableFieldComponent_1.EditableFieldComponent {
	}
	class RecordPredicate extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            potentialValues: []
	        };
	    }
	    componentDidMount() {
	        if (this.props.predicate.rangeIsReference) {
	            this.props.dataStore.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, { type: this.props.predicate.range })
	                .then((potentialValues) => this.setState({ potentialValues }));
	        }
	    }
	    createNewRecord() {
	        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
	            predicate: this.props.predicate.uid,
	            entity: this.props.entity_id,
	            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
	            score: 3,
	            source: this.props.dataStore.defaultSource
	        }));
	    }
	    deleteRecord(record) {
	        if (record.uid === null) {
	            throw new Error('Trying to delete a record with null id');
	        }
	        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
	            .then(() => {
	            this.props.onChange();
	        });
	    }
	    recordChanged(record) {
	        this.props.dataStore.putItem(falcon_core_1.Record, ApiService_1.AppUrls.record, this.props.entity_id, falcon_core_1.Serializer.toJson(record));
	    }
	    render() {
	        if (this.props.predicate.uid === null) {
	            throw new Error('Expected uid to be a number, it was null');
	        }
	        return (React.createElement("section", null,
	            React.createElement("h5", { className: 'section-header' },
	                this.props.predicate.label,
	                " ",
	                React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: `Add new ${this.props.predicate.label} record` }),
	                React.createElement(AddTabButton_1.AddTabButton, { uid: this.props.predicate.uid, tabType: 'predicate' })),
	            React.createElement("table", { className: 'record-editing-table' },
	                React.createElement("thead", null,
	                    React.createElement("tr", { className: 'record-row title' },
	                        React.createElement("th", { className: 'record-row-item uid' }, "ID"),
	                        this.props.predicate.range !== 'source' ? (React.createElement("th", { className: 'record-row-item' }, "Value")) : null,
	                        React.createElement("th", { className: 'record-row-item' }, "Source"),
	                        React.createElement("th", { className: 'record-row-item score' }, "Score"),
	                        React.createElement("th", { className: 'record-row-item score' }, "Period"),
	                        React.createElement("th", { className: 'record-row-item buttons' }, "Actions"))),
	                React.createElement("tbody", null, this.props.records.map((record) => (React.createElement(RecordEditableFieldComponent, { key: `row-${record.uid}`, value: record, onChange: this.recordChanged.bind(this), onDelete: this.deleteRecord.bind(this), component: RecordRow_1.RecordRow, additionalProps: {
	                        dimension: 'predicates',
	                        sources: this.props.sources,
	                        entities: this.state.potentialValues,
	                    } })))))));
	    }
	}
	exports.RecordPredicate = RecordPredicate;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	var EditableFieldComponent_1 = __webpack_require__(31);
	exports.EditableFieldComponent = EditableFieldComponent_1.EditableFieldComponent;
	const ScorePicker_1 = __webpack_require__(37);
	const ComboDropdown_1 = __webpack_require__(19);
	const StringFieldEditor_1 = __webpack_require__(38);
	const EntityFieldEditor_1 = __webpack_require__(39);
	const DateFieldEditor_1 = __webpack_require__(40);
	const IntegerFieldEditor_1 = __webpack_require__(44);
	const AddTabButton_1 = __webpack_require__(45);
	const formatDate_1 = __webpack_require__(43);
	const lodash_1 = __webpack_require__(21);
	const createNewSource = (initialValue) => {
	    const a = {
	        name: 'source',
	        complete: () => {
	            // TODO : Automatically reload sources
	        },
	        cancel: () => { console.log('cancel'); },
	        settings: {
	            initialValue
	        }
	    };
	    this.props.modalStore.addModal(a);
	};
	const recordEditor = (props, record) => {
	    switch (record.valueType) {
	        case 'string':
	            return (React.createElement(StringFieldEditor_1.StringFieldEditor, { value: record.value || '', onChange: (value) => props.onChange(Object.assign(record, { value })) }));
	        case 'date':
	            return (React.createElement(DateFieldEditor_1.DateFieldEditor, { value: record.value || '', onChange: (value) => props.onChange(Object.assign(record, { value })) }));
	        case 'integer':
	            return (React.createElement(IntegerFieldEditor_1.IntegerFieldEditor, { value: record.value || '', onChange: (value) => props.onChange(Object.assign(record, { value })) }));
	        case 'entity':
	            return (React.createElement(EntityFieldEditor_1.EntityFieldEditor, { value: record.value === null ? 0 : parseInt(record.value), onChange: (value) => props.onChange(Object.assign(record, { value })), entities: props.entities }));
	        default:
	            return (React.createElement("div", null, "Missing editor"));
	    }
	};
	const formatValue = (props, record) => {
	    if (record.valueType === 'entity') {
	        const entity = props.entities.find((entity) => entity.uid == record.value);
	        if (entity !== undefined) {
	            if (entity.uid === null) {
	                throw Error('Unexpected null ID on entity');
	            }
	            return (React.createElement("span", null,
	                entity.label,
	                " ",
	                React.createElement(AddTabButton_1.AddTabButton, { uid: entity.uid, tabType: 'entity' })));
	        }
	        else {
	            return (React.createElement("em", null, "Missing Entity"));
	        }
	    }
	    if (record.valueType === 'date') {
	        return (React.createElement("span", null, formatDate_1.formatDate(record.value)));
	    }
	    return (React.createElement("span", null, record.value));
	};
	exports.RecordRow = (props) => {
	    const recordValue = props.value;
	    if (recordValue === null) {
	        throw new Error('Should not be null!!');
	    }
	    const currentSource = props.sources.find((source) => source.uid === recordValue.source);
	    const dropDownValue = {
	        key: '', value: recordValue.source === null ? null : lodash_1.toString(recordValue.source)
	    };
	    if (currentSource !== undefined) {
	        dropDownValue.key = currentSource.label;
	    }
	    if (props.edit) {
	        return (React.createElement("tr", { className: 'record-row' },
	            React.createElement("td", { className: 'record-row-item uid' }, recordValue.uid),
	            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, recordEditor(props, recordValue))) : null,
	            React.createElement("td", { className: 'record-row-item' },
	                React.createElement(ComboDropdown_1.ComboDropdown, { options: props.sources.map((source) => ({ key: source.label, value: source.uid !== null ? lodash_1.toString(source.uid) : null })), typeName: 'source', value: dropDownValue, setValue: (combo) => props.onChange(Object.assign(recordValue, { source: combo === null ? combo : combo.value })), createNewValue: createNewSource })),
	            React.createElement("td", { className: 'record-row-item score' },
	                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: false, onChange: (score) => props.onChange(Object.assign(recordValue, { score })) })),
	            React.createElement("td", { className: 'record-row-item period' },
	                React.createElement(DateFieldEditor_1.DateFieldEditor, { value: recordValue.period || '', onChange: (period) => props.onChange(Object.assign(recordValue, { period })) })),
	            React.createElement("td", { className: 'record-row-item buttons' },
	                React.createElement("button", null,
	                    React.createElement("i", { className: 'fa fa-check', onClick: props.acceptChanges, "aria-hidden": 'true' })),
	                React.createElement("button", null,
	                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true', onClick: props.cancelChanges })))));
	    }
	    else {
	        return (React.createElement("tr", { className: 'record-row' },
	            React.createElement("td", { className: 'record-row-item uid' },
	                "#",
	                recordValue.uid),
	            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, formatValue(props, recordValue))) : null,
	            React.createElement("td", { className: 'record-row-item' },
	                dropDownValue.key,
	                dropDownValue.key.length > 0 && dropDownValue.value !== null ? (React.createElement(AddTabButton_1.AddTabButton, { uid: parseInt(dropDownValue.value), tabType: 'source' })) : null),
	            React.createElement("td", { className: 'record-row-item score' },
	                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: true })),
	            React.createElement("td", { className: 'record-row-item period' }, formatDate_1.formatDate(recordValue.period)),
	            React.createElement("td", { className: 'record-row-item buttons' },
	                React.createElement("button", null,
	                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', onClick: props.setEdit, "aria-hidden": 'true' })),
	                React.createElement("button", null,
	                    React.createElement("i", { className: 'fa fa-trash', "aria-hidden": 'true', onClick: props.onDelete })))));
	    }
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const lodash_1 = __webpack_require__(21);
	exports.ScorePicker = (props) => {
	    const values = [1, 2, 3, 4, 5];
	    if (props.readOnly) {
	        return (React.createElement("span", { className: 'score-picker' }, values.map((val) => (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), "aria-hidden": 'true' })))));
	    }
	    else {
	        return (React.createElement("span", { className: 'score-picker editing' }, lodash_1.reverse(values).map((val) => (React.createElement("i", { key: val, className: 'fa fa-star' + (val > props.value ? '-o' : ''), onClick: () => {
	                if (props.onChange === undefined) {
	                    throw new Error('An onChange handler is required');
	                }
	                props.onChange(val);
	            }, "aria-hidden": 'true' })))));
	    }
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.StringFieldEditor = (props) => {
	    return (React.createElement("input", { type: 'text', value: props.value, onChange: (e) => props.onChange(e.target.value) }));
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Entity Field Editor - select box for entities
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const ComboDropdown_1 = __webpack_require__(19);
	const lodash_1 = __webpack_require__(21);
	exports.EntityFieldEditor = (props) => {
	    // build the options list
	    const options = props.entities.map((entity) => ({ key: entity.label, value: entity.uid !== null ? lodash_1.toString(entity.uid) : null }));
	    // find the default option to display
	    let selectedOption = options.find((opt) => opt.value !== null && parseInt(opt.value) === props.value);
	    if (selectedOption === undefined) {
	        selectedOption = { key: '', value: '' };
	    }
	    return (React.createElement(ComboDropdown_1.ComboDropdown, { options: options, typeName: 'entity type', allowNew: false, value: selectedOption, setValue: (val) => val !== null && val.value !== null ? props.onChange(parseInt(val.value)) : props.onChange(null), createNewValue: lodash_1.noop }));
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const DatePickerDropdown_1 = __webpack_require__(41);
	exports.DateFieldEditor = (props) => {
	    return (React.createElement("div", { className: 'date-selector' },
	        React.createElement(DatePickerDropdown_1.DatePickerDropdown, { value: props.value, setValue: props.onChange })));
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const moment = __webpack_require__(42);
	const lodash_1 = __webpack_require__(21);
	const formatDate_1 = __webpack_require__(43);
	class DatePickerDropdown extends React.Component {
	    constructor() {
	        super();
	        //TODO: should be false
	        this.state = {
	            showingDropDown: false
	        };
	        if (document !== undefined) {
	            this.boundWindowClick = () => {
	                if (!this.ignoreGlobalClick) {
	                    this.setState({
	                        showingDropDown: false
	                    });
	                }
	                else {
	                    this.ignoreGlobalClick = false;
	                }
	            };
	            document.body.addEventListener('click', this.boundWindowClick);
	        }
	    }
	    componentWillMount() {
	        this.ignoreBlur = false;
	        this.ignoreClick = false;
	        this.ignoreGlobalClick = false;
	    }
	    componentWillUnmount() {
	        document.body.removeEventListener('click', this.boundWindowClick);
	    }
	    componentWillReceiveProps(newProps) {
	        // this.updateFilter(newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString, newProps);
	        // this.setState({
	        //     searchString: newProps.value.key !== this.props.value.key ? newProps.value.key : this.state.searchString,
	        //     selected: newProps.value,
	        //     options: newProps.options
	        // });
	    }
	    //should be false
	    handleInputBlur() {
	        if (!this.ignoreBlur) {
	            this.setState({
	                showingDropDown: false
	            });
	        }
	        else {
	            this.ignoreBlur = false;
	        }
	    }
	    handleInputFocus() {
	        if (this.ignoreBlur) {
	            this.ignoreBlur = true;
	            return;
	        }
	        // We don't want `selectItemFromMouse` to trigger when
	        // the user clicks into the input to focus it, so set this
	        // flag to cancel out the logic in `handleInputClick`.
	        // The event order is:  MouseDown -> Focus -> MouseUp -> Click
	        this.ignoreClick = true;
	        this.setState({ showingDropDown: true });
	    }
	    handleInputClick() {
	        // Input will not be focused if it's disabled
	        if (this.isInputFocused() && this.state.showingDropDown === false) {
	            this.setState({ showingDropDown: true });
	        }
	        else {
	            //  if (this.state.highlightedIndex !== null && !this.ignoreClick) {
	            //      this.selectItemFromMouse(this.state.filteredOptions[this.state.highlightedIndex]);
	            //  } else {
	            this.ignoreClick = false;
	        }
	    }
	    selectItemFromMouse(item) {
	        this.setState({
	            showingDropDown: false
	        }, () => {
	            this.props.setValue(item);
	        });
	    }
	    isInputFocused() {
	        const el = this.refs[DatePickerDropdown.datePickerDropDownInputBoxRef];
	        return el.ownerDocument && (el === el.ownerDocument.activeElement);
	    }
	    onDropdownClick() {
	        this.ignoreBlur = true;
	        this.ignoreGlobalClick = true;
	        console.log('clicked');
	    }
	    rangeTypeChanged(rangeType) {
	        this.props.setValue(rangeType + this.props.value.substr(1));
	    }
	    yearChanged(e) {
	        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
	        let yearVal = e.currentTarget.value.substr(0, 4).replace(/[^0-9]/g, '');
	        for (let i = yearVal.length; i < 4; i += 1) {
	            yearVal += 'X';
	        }
	        this.props.setValue(base.substr(0, 1) + yearVal + base.substr(5));
	    }
	    monthChanged(e) {
	        this.ignoreGlobalClick = true;
	        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
	        const monthVal = e.currentTarget.value.substr(0, 2);
	        this.props.setValue(base.substr(0, 5) + monthVal + base.substr(7));
	    }
	    dayChanged(e) {
	        const base = this.props.value.length === 9 ? this.props.value : '=XXXX0000';
	        let dayVal = e.currentTarget.value.substr(0, 2).replace(/[^0-9]/g, '');
	        dayVal = lodash_1.padStart(dayVal, 2, '0');
	        this.props.setValue(base.substr(0, 7) + dayVal);
	    }
	    render() {
	        let rangeOption = this.props.value.substr(0, 1);
	        if (['<', '>', '='].indexOf(rangeOption) === -1) {
	            rangeOption = '=';
	        }
	        const rangeOptionClassName = (val) => {
	            if (val === rangeOption) {
	                return 'range-option selected';
	            }
	            else {
	                return 'range-option';
	            }
	        };
	        const year = this.props.value.substr(1, 4).replace(/X/g, '');
	        const month = this.props.value.substr(5, 2);
	        const day = this.props.value[7] === '0' ? this.props.value[8] === '0' ?
	            ''
	            : this.props.value.substr(8, 1)
	            : this.props.value.substr(7, 2);
	        const displayValue = formatDate_1.formatDate(this.props.value);
	        return (React.createElement("div", { className: 'combo-dropdown' },
	            React.createElement("div", null,
	                React.createElement("input", { type: 'text', readOnly: true, ref: DatePickerDropdown.datePickerDropDownInputBoxRef, className: 'search-input', value: displayValue, onBlur: this.handleInputBlur.bind(this), onFocus: this.handleInputFocus.bind(this), onClick: this.handleInputClick.bind(this) })),
	            this.state.showingDropDown ? (React.createElement("div", { className: 'dropdown' },
	                React.createElement("div", { className: 'date-picker-dropdown', onMouseDown: this.onDropdownClick.bind(this) },
	                    React.createElement("section", { className: 'range-type' },
	                        React.createElement("div", { className: rangeOptionClassName('<'), onClick: () => this.rangeTypeChanged('<') }, "Before"),
	                        React.createElement("div", { className: rangeOptionClassName('='), onClick: () => this.rangeTypeChanged('=') }, "Exactly"),
	                        React.createElement("div", { className: rangeOptionClassName('>'), onClick: () => this.rangeTypeChanged('>') }, "After")),
	                    React.createElement("section", { className: 'date-select' },
	                        React.createElement("div", { className: 'date-selector day' },
	                            React.createElement("label", { className: 'small' }, "Day"),
	                            React.createElement("input", { type: 'text', maxLength: 2, value: day, onChange: this.dayChanged.bind(this) })),
	                        React.createElement("div", { className: 'date-selector month' },
	                            React.createElement("label", { className: 'small' }, "Month"),
	                            React.createElement("select", { onChange: this.monthChanged.bind(this), value: month },
	                                React.createElement("option", { value: '00' }, "Unknown"),
	                                moment.months().map((month, i) => (React.createElement("option", { key: `option-${month}`, value: lodash_1.padStart((i + 1).toString(), 2, '0') }, month))))),
	                        React.createElement("div", { className: 'date-selector year' },
	                            React.createElement("label", { className: 'small' }, "Year"),
	                            React.createElement("input", { type: 'text', maxLength: 4, value: year, onChange: this.yearChanged.bind(this) })))))) : null));
	    }
	}
	DatePickerDropdown.datePickerDropDownInputBoxRef = 'datePickerDropDownInputBox';
	exports.DatePickerDropdown = DatePickerDropdown;


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("moment");

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const moment = __webpack_require__(42);
	exports.formatDate = (str) => {
	    if (str === null || str.length === 0) {
	        return '';
	    }
	    const modifier = {
	        '=': '',
	        '>': 'After ',
	        '<': 'Before '
	    }[str[0]];
	    const year = str.substr(1, 4);
	    const rawMonth = parseInt(str.substr(5, 2)) - 1;
	    const month = rawMonth === -1 || isNaN(rawMonth) ? 'Unknown' : moment.months()[rawMonth];
	    const rawDay = parseInt(str.substr(7, 2));
	    const day = rawDay > 0 ? rawDay : '';
	    return `${modifier} ${day} ${month} ${year}`;
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.IntegerFieldEditor = (props) => {
	    const integerFieldChangeHandler = (e) => props.onChange(e.target.value);
	    return (React.createElement("input", { type: 'number', value: props.value, onChange: integerFieldChangeHandler }));
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const mobx_react_1 = __webpack_require__(23);
	exports.AddTabButton = mobx_react_1.inject('dataStore')(mobx_react_1.observer((props, context) => {
	    if (props.dataStore.dataStore.tabs[props.tabType] !== undefined
	        && props.dataStore.dataStore.tabs[props.tabType].has(`${props.tabType}-${props.uid}`)) {
	        return (React.createElement("i", { className: 'fa fa-folder-open-o add button', title: 'Open item', onClick: () => context.router.transitionTo(`/edit/${props.tabType}/${props.uid}`) }, " "));
	    }
	    return (React.createElement("i", { className: 'icon-list-add add button', title: 'Add to list', onClick: () => props.dataStore.createTab(props.tabType, props.uid, 'item', props.data) }));
	}));
	exports.AddTabButton.wrappedComponent.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	const React = __webpack_require__(2);
	var EditableFieldComponent_1 = __webpack_require__(31);
	exports.EditableFieldComponent = EditableFieldComponent_1.EditableFieldComponent;
	const ComboDropdown_1 = __webpack_require__(19);
	exports.EditableComboDropdown = (props) => {
	    if (props.edit) {
	        return (React.createElement("div", null,
	            React.createElement(ComboDropdown_1.ComboDropdown, __assign({}, props.comboSettings, { value: props.value, setValue: props.onChange, allowNew: false, createNewValue: () => { } })),
	            React.createElement("button", null,
	                React.createElement("i", { className: 'fa fa-check', onClick: props.acceptChanges, "aria-hidden": 'true' })),
	            React.createElement("button", null,
	                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true', onClick: props.cancelChanges }))));
	    }
	    else {
	        return (React.createElement("div", null,
	            props.value !== null && props.value.key.length > 0 ? props.value.key
	                : (React.createElement("em", null, "No value")),
	            React.createElement("sup", null,
	                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: props.setEdit }))));
	    }
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const AddTabButton_1 = __webpack_require__(45);
	// What can I do?
	// Entity Operations
	// - Delete the entity
	// - Merge the entity
	// - Split the entity
	// - Add 'same-as-ses' to the entity
	// Records
	// - Order records by type, source and date
	// - Add new records
	// - Adding a new predicate creates a new record with the
	//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
	//   it also creates a blank entry in the records sub table based on the range of the predicate.
	// - New predicates must have a name. The domain is set to the current entitytype but can be changed
	//   to one of its parents. The range MUST be set.
	// Visualisations:
	// - Network graph of entity relationships
	class EntityWorkspaceReferenceView extends React.Component {
	    constructor(props, context) {
	        super();
	        this.state = {
	            comboValue: { key: 'test', value: '' },
	            comboSearchValue: ''
	        };
	    }
	    update(data) {
	        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
	    }
	    render() {
	        return (React.createElement("section", { className: 'editor-body' },
	            React.createElement("h2", null, "References"),
	            React.createElement("table", { className: 'table' },
	                React.createElement("thead", null,
	                    React.createElement("tr", null,
	                        React.createElement("th", null, "Entity"),
	                        React.createElement("th", null, "Property"))),
	                React.createElement("tbody", null, this.props.dataStore.dataStore.tabs.entity.get('entity-' + this.props.id).value.referenceRecords.map((record) => {
	                    return (React.createElement("tr", { key: `record-${record.uid}` },
	                        React.createElement("td", null,
	                            this.props.dataStore.dataStore.all.entity.value.find((entity) => entity.uid === record.entity).label,
	                            " ",
	                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: record.entity })),
	                        React.createElement("td", null,
	                            this.props.dataStore.dataStore.all.predicate.value.find((predicate) => predicate.uid === record.predicate).label,
	                            " ",
	                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'predicate', uid: record.predicate }))));
	                })))));
	    }
	}
	EntityWorkspaceReferenceView.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	exports.EntityWorkspaceReferenceView = EntityWorkspaceReferenceView;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Predicate editor workspace
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const SameAsEditor_1 = __webpack_require__(49);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const AddTabButton_1 = __webpack_require__(45);
	const EditableHeader_1 = __webpack_require__(30);
	const EditableParagraph_1 = __webpack_require__(51);
	const EditableComboDropdown_1 = __webpack_require__(46);
	const mobx_react_1 = __webpack_require__(23);
	class StringEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	class ComboEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	let EntityTypeWorkspace = class EntityTypeWorkspace extends React.Component {
	    constructor() {
	        super();
	        this.state = {};
	    }
	    update(data) {
	        const entityType = this.props.dataStore.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
	        this.props.dataStore.patchItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id, data)
	            .then(() => this.setState({ entityType: Object.assign({}, entityType, data) }));
	    }
	    copy() {
	        const entityType = this.props.dataStore.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
	        const newEntityType = falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, Object.assign({}, falcon_core_1.Serializer.toJson(entityType), { name: 'Copy of ' + entityType.label }));
	        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, newEntityType)
	            .then(([id]) => {
	            this.props.dataStore.createTab('entity_type', id, 'item');
	        });
	    }
	    del() {
	        this.props.dataStore.delItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id)
	            .then(() => this.context.router.transitionTo('/edit/notfound'))
	            .catch((e) => {
	            e.data.then((data) => {
	                const conflictResolutionModal = {
	                    name: 'conflict_resolution',
	                    cancel: () => { },
	                    complete: (result) => {
	                        if (result === 'addToWorkspace') {
	                            data.entityType.forEach((datum) => {
	                                this.props.dataStore.createTab('entity_type', datum.uid, 'item');
	                            });
	                            data.predicate.forEach((datum) => {
	                                this.props.dataStore.createTab('predicate', datum.uid, 'item');
	                            });
	                            data.entity.forEach((datum) => {
	                                this.props.dataStore.createTab('entity', datum.uid, 'item');
	                            });
	                        }
	                    },
	                    settings: {
	                        conflictingItems: data,
	                        message: 'Deleting Entity Type'
	                    }
	                };
	                this.props.modalStore.addModal(conflictResolutionModal);
	            });
	        });
	    }
	    createEntity() {
	        const a = {
	            name: 'entity',
	            complete: ([id]) => {
	                this.props.dataStore.createTab('entity', id, 'item');
	            },
	            cancel: () => { console.log('cancel'); },
	            settings: {
	                initialName: '',
	                initialType: this.props.id
	            }
	        };
	        this.props.modalStore.addModal(a);
	    }
	    render() {
	        const entityType = this.props.dataStore.dataStore.tabs.entity_type.get('entity_type-' + this.props.id).value;
	        const potentialParents = this.props.dataStore.dataStore.all.entity_type.value;
	        let parentName = '';
	        if (potentialParents !== null && entityType.parent !== undefined) {
	            const found = potentialParents.find((par) => par.uid === entityType.parent);
	            if (found !== undefined) {
	                parentName = found.label;
	            }
	        }
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header entity_type' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("div", { className: 'bread-crumbs' }, entityType.parents.map((parent, i) => (React.createElement("span", { key: `breadcrumb-${parent.uid}` },
	                            React.createElement("span", null,
	                                "  ",
	                                parent.label,
	                                " ",
	                                React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: parent.uid }),
	                                " "),
	                            React.createElement("i", { className: 'fa fa-angle-right' }))))),
	                        React.createElement("i", { className: 'fa fa-tag item-icon' }),
	                        React.createElement(StringEditableFieldComponent, { value: entityType.label, component: EditableHeader_1.EditableHeader, onChange: (value) => this.update({ 'label': value }) })),
	                    React.createElement("div", { className: 'sub-toolbar' },
	                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
	                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
	                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'entity_type selected' }, "CORE")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement("label", { className: 'small' }, "Parent"),
	                    React.createElement(ComboEditableFieldComponent, { value: entityType.parent === null ? null : { key: parentName, value: entityType.parent }, component: EditableComboDropdown_1.EditableComboDropdown, onChange: (value) => this.update({ 'parent': value === null ? null : value.value }), additionalProps: { comboSettings: {
	                                options: potentialParents.map((par) => ({ key: par.label, value: par.uid })),
	                                typeName: 'EntityType'
	                            } } }),
	                    entityType.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: entityType.parent })) : null),
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement("label", { className: 'small' }, "Description"),
	                    React.createElement(StringEditableFieldComponent, { value: entityType.description, component: EditableParagraph_1.EditableParagraph, onChange: (value) => this.update({ 'description': value }) })),
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement(StringEditableFieldComponent, { value: entityType.sameAs, component: SameAsEditor_1.SameAsEditor, onChange: (value) => this.update({ 'sameAs': value }) })),
	                React.createElement("div", null,
	                    React.createElement("h4", null, "Direct Children"),
	                    React.createElement("ul", null, entityType.children
	                        .map((child) => this.props.dataStore.dataStore.all.entity_type.value.find((et) => et.uid === child))
	                        .map((childEt) => (React.createElement("li", { key: `dc-${childEt.label}` },
	                        childEt.label,
	                        " ",
	                        React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: childEt.uid })))))))));
	    }
	};
	EntityTypeWorkspace.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	EntityTypeWorkspace = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], EntityTypeWorkspace);
	exports.EntityTypeWorkspace = EntityTypeWorkspace;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const mousetrap = __webpack_require__(50);
	class SameAsEditor extends React.Component {
	    constructor(props) {
	        super();
	        this.state = {
	            temporaryValue: '',
	            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
	        };
	    }
	    componentWillReceiveProps(props) {
	        this.setState({
	            temporaryValue: '',
	            urls: props.value === null || props.value.length === 0 ? [] : props.value.split(',')
	        });
	    }
	    addItemToList() {
	        if (this.state.temporaryValue.length === 0) {
	            return;
	        }
	        this.setState({ urls: this.state.urls.concat([this.state.temporaryValue]), temporaryValue: '' }, () => this.props.onChange(this.state.urls.join(',')));
	    }
	    removeItemFromList(itemId) {
	        this.setState({
	            urls: this.state.urls.filter((val, i) => i !== itemId)
	        }, () => this.props.onChange(this.state.urls.join(',')));
	    }
	    setupKeyboardShortcuts(val) {
	        if (val !== null) {
	            val.focus();
	            this.keyboardShortcuts = new mousetrap(val);
	            this.keyboardShortcuts.bind('return', this.addItemToList.bind(this));
	            this.keyboardShortcuts.bind('escape', this.props.cancelChanges);
	            this.keyboardShortcuts.bind('ctrl+s', (e) => {
	                if (e.preventDefault) {
	                    e.preventDefault();
	                }
	                else {
	                    // internet explorer
	                    e.returnValue = false;
	                }
	                this.props.acceptChanges();
	            });
	        }
	        else {
	            this.keyboardShortcuts.unbind('return');
	            this.keyboardShortcuts.unbind('escape');
	            this.keyboardShortcuts.unbind('ctrl+s');
	        }
	    }
	    render() {
	        return (React.createElement("div", { className: 'same-as-box' },
	            React.createElement("label", { className: 'small' },
	                "Same As ",
	                !this.props.edit ? (React.createElement("sup", null,
	                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: this.props.setEdit }))) : null),
	            this.props.edit ? (React.createElement("div", { className: 'edit-group' },
	                React.createElement("button", { onClick: this.props.acceptChanges },
	                    React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
	                React.createElement("button", { onClick: this.props.cancelChanges },
	                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })),
	                React.createElement("div", { className: 'input-addon-formgroup' },
	                    React.createElement("input", { type: 'text', value: this.state.temporaryValue, ref: this.setupKeyboardShortcuts.bind(this), onChange: (e) => this.setState({ temporaryValue: e.target.value }), className: 'form-control with-addon' }),
	                    React.createElement("span", { className: 'input-addon-icon right button', onClick: this.addItemToList.bind(this) },
	                        React.createElement("i", { className: 'fa fa-plus' }))))) : null,
	            React.createElement("ul", { className: 'same-as-list' }, this.state.urls.map((url, i) => (React.createElement("li", { key: `li-${url}` },
	                React.createElement("a", { target: '_blank', href: url }, url),
	                " ",
	                this.props.edit ? (React.createElement("i", { className: 'fa fa-times close-button', onClick: this.removeItemFromList.bind(this, i) })) : null))))));
	    }
	}
	exports.SameAsEditor = SameAsEditor;


/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = require("mousetrap");

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	var EditableFieldComponent_1 = __webpack_require__(31);
	exports.EditableFieldComponent = EditableFieldComponent_1.EditableFieldComponent;
	const mousetrap = __webpack_require__(50);
	exports.EditableParagraph = (props) => {
	    let keyBoardShortcuts;
	    const bindKeyboard = (val) => {
	        if (val !== null) {
	            val.focus();
	            keyBoardShortcuts = new mousetrap(val);
	            keyBoardShortcuts.bind('ctrl+return', props.acceptChanges);
	            keyBoardShortcuts.bind('escape', props.cancelChanges);
	        }
	        else {
	            keyBoardShortcuts.unbind('ctrl+return');
	        }
	    };
	    if (!props.edit) {
	        return (React.createElement("div", { onClick: props.setEdit, className: 'editable-paragraph-box' },
	            React.createElement("p", null,
	                props.value === null || props.value.length > 0 ? props.value
	                    : (React.createElement("em", null, "No value")),
	                React.createElement("sup", null,
	                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true' })))));
	    }
	    else {
	        return (React.createElement("div", null,
	            React.createElement("textarea", { value: props.value, ref: bindKeyboard, onChange: (e) => props.onChange(e.target.value), style: { width: '100%', height: '6em' } }),
	            React.createElement("button", { onClick: props.acceptChanges },
	                React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
	            React.createElement("button", { onClick: props.cancelChanges },
	                React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' }))));
	    }
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Predicate editor workspace
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const SameAsEditor_1 = __webpack_require__(49);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const EditableHeader_1 = __webpack_require__(30);
	const EditableParagraph_1 = __webpack_require__(51);
	const EditableComboDropdown_1 = __webpack_require__(46);
	const lodash_1 = __webpack_require__(21);
	const mobx_react_1 = __webpack_require__(23);
	const AddTabButton_1 = __webpack_require__(45);
	class StringEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	class ComboEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	// - Should state the number of times this predicate is used
	// - Widening the domain or range always okay
	// - Narrowing should check for conflicts and return them
	// - Asks 'Delete conflicting records?'
	// - Strong check (double button press or type) to confirm
	// - Changing name/description/sameAs - absolutly fine
	// - Cannot change 'readonly'
	let SourceEditorWorkspace = class SourceEditorWorkspace extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            metaData: {}
	        };
	    }
	    componentDidMount() {
	        this.loadData(this.props);
	    }
	    componentWillReceiveProps(newProps) {
	        this.loadData(newProps);
	    }
	    loadData(props) {
	        const source = props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source;
	        this.setState({
	            metaData: lodash_1.keyBy(source.metaData, 'name')
	        });
	    }
	    updateSource(field, value) {
	        const source = this.props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source;
	        this.props.dataStore.patchItem(falcon_core_1.Source, ApiService_1.AppUrls.source, source.uid, { [field]: value });
	    }
	    updateSourceElement(element, value) {
	        const source = this.props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source;
	        const compositeKey = {
	            order: ['source', 'element'],
	            values: {
	                source: this.props.id,
	                element: element.uid
	            }
	        };
	        if (source.metaData[element.label] !== undefined
	            && source.metaData[element.label].values.find((a) => a.source === this.props.id) !== undefined) {
	            this.props.dataStore.patchItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, compositeKey, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
	                uid: compositeKey,
	                element: source.metaData[element.label].element_uid,
	                source: this.props.id,
	                value
	            }));
	        }
	        else {
	            this.props.dataStore.postItem(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, falcon_core_1.Serializer.fromJson(falcon_core_1.SourceElement, {
	                uid: compositeKey,
	                value: value
	            }));
	        }
	    }
	    del() {
	        this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, this.props.id)
	            .then(() => this.context.router.transitionTo('/edit/notfound'))
	            .catch((e) => {
	            e.data.then((data) => {
	                const conflictResolutionModal = {
	                    name: 'conflict_resolution',
	                    cancel: () => { },
	                    complete: (result) => {
	                        if (result === 'addToWorkspace') {
	                            data.source.forEach((datum) => {
	                                this.props.dataStore.createTab('source', datum.uid, 'item');
	                            });
	                        }
	                        if (result === 'deleteAll') {
	                            Promise.all(data.source.map((datum) => this.props.dataStore.delItem(falcon_core_1.Source, ApiService_1.AppUrls.source, datum.uid)))
	                                .then(() => {
	                                this.del();
	                            });
	                        }
	                    },
	                    settings: {
	                        conflictingItems: data,
	                        message: 'Deleting Source'
	                    }
	                };
	                this.props.modalStore.addModal(conflictResolutionModal);
	            });
	        });
	    }
	    createChild() {
	        const source = this.props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source;
	        const newSource = falcon_core_1.Serializer.fromJson(falcon_core_1.Source, Object.assign({}, falcon_core_1.Serializer.toJson(source), { label: 'Child of ' + source.label, parent: this.props.id }));
	        this.props.dataStore.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, newSource)
	            .then(([id]) => {
	            this.props.dataStore.createTab('source', id, 'item');
	        });
	    }
	    // create entity with 'mentioned in' already set to this source
	    createEntity() {
	        const a = {
	            name: 'preset_record',
	            complete: ([id]) => {
	                this.props.dataStore.createTab('entity', id, 'item');
	            },
	            cancel: () => { },
	            settings: {
	                source: this.props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source
	            }
	        };
	        this.props.modalStore.addModal(a);
	    }
	    render() {
	        const source = this.props.dataStore.dataStore.tabs.source.get('source-' + this.props.id).value.source;
	        const potentialParents = this.props.dataStore.dataStore.all.source.value;
	        let parentName = '';
	        if (potentialParents !== null && source.parent !== undefined) {
	            const found = potentialParents.find((par) => par.uid === source.parent);
	            if (found !== undefined) {
	                parentName = found.label;
	            }
	        }
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header source' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("div", { className: 'bread-crumbs' }, source.parents
	                            .slice()
	                            .reverse()
	                            .map((child) => this.props.dataStore.dataStore.all.source.value.find((et) => et.uid === child))
	                            .map((parent, i) => (React.createElement("span", { key: `breadcrumb-${parent.uid}` },
	                            React.createElement("span", null,
	                                "  ",
	                                parent.label,
	                                " ",
	                                React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: parent.uid }),
	                                " "),
	                            React.createElement("i", { className: 'fa fa-angle-right' }))))),
	                        React.createElement("i", { className: 'fa fa-sun-o item-icon' }),
	                        React.createElement(StringEditableFieldComponent, { value: source.label, component: EditableHeader_1.EditableHeader, onChange: (value) => this.updateSource('label', value) })),
	                    React.createElement("div", { className: 'sub-toolbar' },
	                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
	                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: () => this.del() }),
	                        React.createElement("i", { className: 'fa fa-arrow-circle-o-down button', "aria-hidden": 'true', onClick: this.createChild.bind(this) }))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'source selected' }, "DUBLIN CORE"),
	                        React.createElement("div", { className: 'source' }, "DETAILS"),
	                        React.createElement("div", { className: 'source' }, "MEDIA")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement("label", { className: 'small' }, "Parent"),
	                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: source.parent }, component: EditableComboDropdown_1.EditableComboDropdown, onChange: (value) => this.updateSource('parent', value.value), additionalProps: { comboSettings: {
	                                options: potentialParents.map((par) => ({ key: par.label, value: par.uid })),
	                                typeName: 'Source'
	                            } } }),
	                    source.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: source.parent })) : null),
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement(StringEditableFieldComponent, { value: source.sameAs, component: SameAsEditor_1.SameAsEditor, onChange: (value) => this.updateSource('sameAs', value) })),
	                this.props.dataStore.dataStore.all.dublinCore.value.elements.map((element) => {
	                    const values = source.metaData.hasOwnProperty(element.label) ?
	                        source.metaData[element.label].values : [{ source: this.props.id, value: '' }];
	                    const editableValue = values[0].source == this.props.id ? values[0].value : '';
	                    return (React.createElement("div", { key: `${element.label}-edit` },
	                        React.createElement("h5", { className: 'section-header' },
	                            element.label,
	                            " ",
	                            React.createElement("small", null,
	                                React.createElement("a", { href: element.url }, element.uri))),
	                        React.createElement("p", { className: 'element-description' }, element.description),
	                        React.createElement("ul", null, values.map((value) => value.source != this.props.id ? (React.createElement("li", { key: `${element.uid}-${value.source}` },
	                            this.props.dataStore.dataStore.all.source.value.find((s) => s.uid === value.source).label,
	                            ": ",
	                            value.value)) : null)),
	                        React.createElement(StringEditableFieldComponent, { value: editableValue, component: EditableParagraph_1.EditableParagraph, onChange: (value) => this.updateSourceElement(element, value) })));
	                }),
	                React.createElement("div", null,
	                    React.createElement("h4", null, "Direct Children"),
	                    React.createElement("ul", null, source.children
	                        .map((child) => this.props.dataStore.dataStore.all.source.value.find((et) => et.uid === child))
	                        .map((childEt) => (React.createElement("li", { key: `dc-${childEt.uid}` },
	                        childEt.label,
	                        " ",
	                        React.createElement(AddTabButton_1.AddTabButton, { tabType: 'source', uid: childEt.uid })))))))));
	    }
	};
	SourceEditorWorkspace.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	SourceEditorWorkspace = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], SourceEditorWorkspace);
	exports.SourceEditorWorkspace = SourceEditorWorkspace;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Predicate editor workspace
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const react_router_1 = __webpack_require__(4);
	const SameAsEditor_1 = __webpack_require__(49);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const EditableHeader_1 = __webpack_require__(30);
	const EditableParagraph_1 = __webpack_require__(51);
	const PredicateDescription_1 = __webpack_require__(54);
	const literalTypes_1 = __webpack_require__(55);
	const mobx_react_1 = __webpack_require__(23);
	class StringEditableFieldComponent extends EditableHeader_1.EditableFieldComponent {
	}
	// - Should state the number of times this predicate is used
	// - Widening the domain or range always okay
	// - Narrowing should check for conflicts and return them
	// - Asks 'Delete conflicting records?'
	// - Strong check (double button press or type) to confirm
	// - Changing name/description/sameAs - absolutly fine
	// - Cannot change 'readonly'
	let PredicateEditorWorkspace = class PredicateEditorWorkspace extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            records: []
	        };
	    }
	    updatePredicate(field, value, rangeIsReferenceOverride = null) {
	        const predicate = this.props.dataStore.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;
	        if (predicate === null) {
	            console.warn('Tried to edit unready predicate');
	            return;
	        }
	        const rangeIsReferenceVal = rangeIsReferenceOverride === null
	            ? predicate.rangeIsReference : rangeIsReferenceOverride;
	        this.props.dataStore.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, predicate.uid, {
	            [field]: value,
	            rangeIsReference: rangeIsReferenceVal
	        });
	    }
	    copy() {
	        const predicate = this.props.dataStore.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;
	        const newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, Object.assign({}, falcon_core_1.Serializer.toJson(predicate), { name: 'Copy of ' + predicate.label }));
	        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate)
	            .then(([id]) => {
	            this.props.dataStore.createTab('predicate', id, 'item');
	        });
	    }
	    del() {
	        this.props.dataStore.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, this.props.id)
	            .then(() => this.context.router.transitionTo('/edit/notfound'))
	            .catch((e) => {
	            e.data.then((data) => {
	                const conflictResolutionModal = {
	                    name: 'conflict_resolution',
	                    cancel: () => { },
	                    complete: (result) => {
	                        if (result === 'addToWorkspace') {
	                            data.forEach((datum) => {
	                                this.props.dataStore.createTab('entity', datum.entity, 'item');
	                            });
	                        }
	                        if (result === 'deleteAll') {
	                            Promise.all(data.record.map((datum) => this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid)))
	                                .then(() => {
	                                this.del();
	                            });
	                        }
	                    },
	                    settings: {
	                        conflictingItems: data,
	                        message: 'Deleting Predicate'
	                    }
	                };
	                this.props.modalStore.addModal(conflictResolutionModal);
	            });
	        });
	    }
	    render() {
	        const predicate = this.props.dataStore.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;
	        const entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
	        const currentDomainEntityType = entityTypes.find((t) => t.uid == predicate.domain);
	        let currentDomainEntityTypeName = '';
	        if (currentDomainEntityType !== undefined) {
	            currentDomainEntityTypeName = currentDomainEntityType.label;
	        }
	        const domain = { key: currentDomainEntityTypeName, value: predicate.domain.toString() };
	        const range = { key: '', value: predicate.range.toString() };
	        if (predicate.rangeIsReference) {
	            const currentRangeEntityType = entityTypes.find((t) => t.uid == predicate.range);
	            if (currentRangeEntityType !== undefined) {
	                range.key = currentRangeEntityType.label;
	            }
	        }
	        else {
	            const literalType = literalTypes_1.literalTypes.find((t) => t.value === predicate.range);
	            if (literalType !== undefined) {
	                range.key = literalType.label;
	            }
	        }
	        const entityTypeOptions = entityTypes.map((t) => {
	            if (t.uid === null) {
	                throw new Error('Encountered entity type with no id!');
	            }
	            return { key: t.label, value: t.uid.toString() };
	        });
	        const literalTypeOptions = literalTypes_1.literalTypes.map((t) => ({ key: t.label, value: t.value, meta: 'literal' }));
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header predicate' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("i", { className: 'fa fa-long-arrow-right item-icon' }),
	                        React.createElement(StringEditableFieldComponent, { value: predicate.label, component: EditableHeader_1.EditableHeader, onChange: (value) => this.updatePredicate('label', value) })),
	                    React.createElement("div", { className: 'sub-toolbar' },
	                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
	                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'predicate selected' }, "CORE")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement("div", null,
	                    React.createElement(react_router_1.Link, { to: `/edit/entity?col1p=${this.props.id}&col1f=exists` },
	                        "Uses: ",
	                        predicate.uses)),
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement("label", { className: 'small' }, "Description"),
	                    React.createElement(StringEditableFieldComponent, { value: predicate.description, component: EditableParagraph_1.EditableParagraph, onChange: (value) => this.updatePredicate('description', value) })),
	                React.createElement("div", { className: 'edit-group' },
	                    React.createElement("label", { className: 'small' }, "Typing"),
	                    React.createElement(PredicateDescription_1.PredicateDescription, { domain: domain, range: range, domainChanged: (value) => this.updatePredicate('domain', value.value), rangeChanged: (value) => this.updatePredicate('range', value.value, value.meta !== 'literal'), mode: 'editSingle', domainOptions: entityTypeOptions, rangeOptions: literalTypeOptions.concat(entityTypeOptions) })),
	                React.createElement("div", null,
	                    React.createElement(StringEditableFieldComponent, { value: predicate.sameAs, component: SameAsEditor_1.SameAsEditor, onChange: (value) => this.updatePredicate('sameAs', value) })))));
	    }
	};
	PredicateEditorWorkspace.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	PredicateEditorWorkspace = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], PredicateEditorWorkspace);
	exports.PredicateEditorWorkspace = PredicateEditorWorkspace;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const ComboDropdown_1 = __webpack_require__(19);
	const lodash_1 = __webpack_require__(21);
	class PredicateDescription extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            editingDomain: false,
	            editingRange: false,
	            rangeValue: { key: '', value: '' },
	            domainValue: { key: '', value: '' }
	        };
	    }
	    componentWillMount() {
	        this.setState({
	            rangeValue: this.props.range,
	            domainValue: this.props.domain
	        });
	    }
	    componentWillReceiveProps(newProps) {
	        this.setState({
	            rangeValue: newProps.range,
	            domainValue: newProps.domain
	        });
	    }
	    acceptDomainChanges() {
	        this.props.domainChanged(this.state.domainValue);
	        this.setState({ editingDomain: false });
	    }
	    cancelDomainChanges() {
	        this.setState({ editingDomain: false, domainValue: this.props.domain });
	    }
	    acceptRangeChanges() {
	        this.props.rangeChanged(this.state.rangeValue);
	        this.setState({ editingRange: false });
	    }
	    cancelRangeChanges() {
	        this.setState({ editingDomain: false, rangeValue: this.props.range });
	    }
	    render() {
	        const domainChanged = this.props.mode === 'editAll' ?
	            this.props.domainChanged : (c) => this.setState({ domainValue: c });
	        const rangeChanged = this.props.mode === 'editAll' ?
	            this.props.rangeChanged : (c) => this.setState({ rangeValue: c });
	        return (React.createElement("div", { className: 'predicate-function-description' },
	            React.createElement("div", { className: 'domain' }, this.props.mode === 'editAll' || this.state.editingDomain ? (React.createElement("div", null,
	                React.createElement("label", { className: 'small' }, "Domain"),
	                React.createElement(ComboDropdown_1.ComboDropdown, { options: this.props.domainOptions, typeName: 'entity type', allowNew: false, value: this.state.domainValue, setValue: domainChanged, createNewValue: lodash_1.noop }),
	                this.props.mode === 'editSingle' ? (React.createElement("div", null,
	                    React.createElement("button", { onClick: this.acceptDomainChanges.bind(this) },
	                        React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
	                    React.createElement("button", { onClick: this.cancelDomainChanges.bind(this) },
	                        React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
	                this.props.domain.key,
	                " ",
	                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: () => this.setState({ editingDomain: true }) })))),
	            React.createElement("div", { className: 'arrow' },
	                React.createElement("i", { className: 'fa fa-long-arrow-right', "aria-hidden": 'true' })),
	            React.createElement("div", { className: 'range' }, this.props.mode === 'editAll' || this.state.editingRange ? (React.createElement("div", null,
	                React.createElement("label", { className: 'small' }, "Range"),
	                React.createElement(ComboDropdown_1.ComboDropdown, { options: this.props.rangeOptions, typeName: 'entity type', allowNew: false, value: this.state.rangeValue, setValue: rangeChanged, createNewValue: lodash_1.noop }),
	                this.props.mode === 'editSingle' ? (React.createElement("div", null,
	                    React.createElement("button", { onClick: this.acceptRangeChanges.bind(this) },
	                        React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
	                    React.createElement("button", { onClick: this.cancelRangeChanges.bind(this) },
	                        React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))) : null)) : (React.createElement("div", null,
	                this.props.range.key,
	                " ",
	                React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true', onClick: () => this.setState({ editingRange: true }) }))))));
	    }
	}
	exports.PredicateDescription = PredicateDescription;


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	exports.literalTypes = [
	    { label: 'text', value: 'string', url: '', description: 'some text' },
	    { label: 'number', value: 'integer', url: '', description: 'a number' },
	    { label: 'date', value: 'date', url: '', description: 'a date' },
	    // { name: 'point', value: 'point', url: '', description: 'a point on a map '},
	    // { name: 'region', value: 'region', url: '', description: 'a region on a map'},
	    { label: 'source', value: 'source', url: '', description: 'a source in the database' }
	];


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	exports.AdvancedSearchWorkspace = (props) => (React.createElement("div", { className: 'workspace-editor' },
	    React.createElement("h2", null, "Advanced Search")));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Empty workspace for when nothing is open!
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const EntityList_1 = __webpack_require__(58);
	const PredicateList_1 = __webpack_require__(60);
	const SourceList_1 = __webpack_require__(61);
	const EntityTypeList_1 = __webpack_require__(63);
	exports.ObjectListWorkspace = (props) => (React.createElement("div", { className: 'workspace-editor object-list' }, (() => {
	    switch (props.listType) {
	        case 'entity':
	            return (React.createElement(EntityList_1.EntityList, { query: props.query }));
	        case 'source':
	            return (React.createElement(SourceList_1.SourceList, null));
	        case 'predicate':
	            return (React.createElement(PredicateList_1.PredicateList, null));
	        case 'entity_type':
	            return (React.createElement(EntityTypeList_1.EntityTypeList, null));
	    }
	})()));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const lev = __webpack_require__(59);
	const ApiService_1 = __webpack_require__(6);
	const falcon_core_1 = __webpack_require__(8);
	const ComboDropdown_1 = __webpack_require__(19);
	const lodash_1 = __webpack_require__(21);
	const AddTabButton_1 = __webpack_require__(45);
	const formatDate_1 = __webpack_require__(43);
	const mobx_react_1 = __webpack_require__(23);
	const sortIcons = {
	    'none': 'fa fa-sort',
	    'asc': 'fa fa-sort-asc',
	    'desc': 'fa fa-sort-desc'
	};
	const customColumns = (predicates, columns, updateColumnParams, rotateSort) => {
	    return [0, 1, 2].map((id) => {
	        const comboValue = { key: '', value: '' };
	        if (columns[id].predicate !== -1) {
	            const thisPred = predicates.find((pred) => pred.uid == columns[id].predicate);
	            if (thisPred !== undefined) {
	                comboValue.key = thisPred.label;
	            }
	            comboValue.value = columns[id].predicate;
	        }
	        return (React.createElement("td", { key: `col-${id}` },
	            React.createElement("div", { className: 'list-combo-header' },
	                React.createElement("div", { className: 'combo-wrapper' },
	                    React.createElement(ComboDropdown_1.ComboDropdown, { value: comboValue, typeName: 'predicate', allowNew: false, setValue: (value) => updateColumnParams(id, 'p', value === null ? null : value.value), options: predicates.map((pred) => ({ key: pred.label, value: pred.uid.toString() })), createNewValue: lodash_1.noop, compact: true })),
	                React.createElement("div", { className: 'order-wrapper' },
	                    React.createElement("i", { className: sortIcons[columns[id].sort], onClick: () => rotateSort(id) })))));
	    });
	};
	let EntityList = class EntityList extends React.Component {
	    constructor(props) {
	        super();
	        this.state = {
	            entities: [],
	            entityTypes: [],
	            predicates: [],
	            columns: [
	                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
	                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
	                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' }
	            ],
	            results: [],
	            entityType: { key: 'Any', value: 0 }
	        };
	    }
	    componentDidMount() {
	        this.update(this.props);
	    }
	    componentWillReceiveProps(newProps) {
	        this.update(newProps);
	    }
	    update(props) {
	        const queryStringOptions = props.query;
	        const columns = lodash_1.cloneDeep(this.state.columns);
	        if (queryStringOptions !== null) {
	            for (let i = 1; i < 4; i += 1) {
	                columns[i - 1].predicate = queryStringOptions[`col${i}p`] || null;
	                columns[i - 1].sort = queryStringOptions[`col${i}s`] || null;
	                columns[i - 1].filterType = queryStringOptions[`col${i}f`] || '';
	                columns[i - 1].filterValue = queryStringOptions[`col${i}v`] || '';
	                columns[i - 1].invertFilter = queryStringOptions[`col${i}i`] || null;
	            }
	        }
	        this.setState({
	            columns,
	            queryData: queryStringOptions === null ? {} : queryStringOptions,
	        }, this.reload.bind(this));
	    }
	    reload() {
	        const setColumns = this.state.columns.filter((col) => col.predicate != -1);
	        this.props.dataStore.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, {
	            predicate: setColumns.map((col) => col.predicate),
	            entity: this.props.dataStore.dataStore.all.entity.value.map((entity) => entity.uid)
	        })
	            .then((results) => this.setState({ results }));
	    }
	    addNew() {
	        const a = {
	            name: 'entity',
	            complete: () => {
	            },
	            cancel: () => { console.log('cancel'); },
	            settings: {
	                initialName: ''
	            }
	        };
	        this.props.modalStore.addModal(a);
	    }
	    updateColumnParams(colId, key, value) {
	        this.context.router.transitionTo({
	            pathname: '/edit/entity',
	            query: Object.assign(this.state.queryData, { [`col${colId + 1}${key}`]: value })
	        });
	    }
	    rotateSort(colId) {
	        const columns = lodash_1.cloneDeep(this.state.columns);
	        switch (columns[colId].sort) {
	            case 'none':
	                columns[colId].sort = 'asc';
	                break;
	            case 'asc':
	                columns[colId].sort = 'desc';
	                break;
	            case 'desc':
	                columns[colId].sort = 'none';
	        }
	        this.setState({
	            columns
	        }, this.reload.bind(this));
	    }
	    addViewTab() {
	        const tabData = {};
	        const mapping = [
	            { key: 'p', display: 'Predicate', mod: (data) => this.props.dataStore.dataStore.all.predicate.value.find((pred) => pred.uid == data).label },
	            { key: 's', display: 'Sort', mod: (data) => data },
	            { key: 'f', display: 'filterType', mod: (data) => data },
	            { key: 'v', display: 'filterValue', mod: (data) => data },
	            { key: 'i', display: 'invertFilter', mod: (data) => data }
	        ];
	        for (let i = 1; i < 4; i += 1) {
	            for (let j = 0; j < mapping.length; j += 1) {
	                if (this.state.queryData[`col${i}${mapping[j].key}`] !== undefined) {
	                    if (tabData[`Column ${i}`] === undefined) {
	                        tabData[`Column ${i}`] = {};
	                    }
	                    tabData[`Column ${i}`][mapping[j].display] = mapping[j].mod(this.state.queryData[`col${i}${mapping[j].key}`]);
	                }
	            }
	        }
	        this.props.dataStore.createTab('entity', Date.now(), 'view', tabData, this.props.query);
	    }
	    render() {
	        const entities = this.props.dataStore.dataStore.all.entity.value;
	        const predicates = this.props.dataStore.dataStore.all.predicate.value;
	        const entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
	        const entityTypeOptions = entityTypes.map((entityType) => ({ key: entityType.label, value: entityType.uid }));
	        const tableData = entities.map((entity) => {
	            const entityType = entityTypes.find((t) => t.uid === entity.entityType);
	            const entityData = this.state.results.filter((res) => res.entity === entity.uid);
	            return {
	                uid: entity.uid,
	                label: entity.label,
	                entityType,
	                columns: this.state.columns.map((col) => {
	                    let value = '';
	                    if (entityData !== undefined && col.predicate !== -1) {
	                        const predicateData = entityData
	                            .filter((record) => record.predicate == col.predicate);
	                        if (predicateData !== undefined) {
	                            value = predicateData.map((pred) => {
	                                if (pred.valueType === 'date') {
	                                    return formatDate_1.formatDate(pred.value);
	                                }
	                                if (pred.valueType === 'source') {
	                                    if (pred.value === null) {
	                                        return 'Not set';
	                                    }
	                                    return this.props.dataStore.dataStore.all.source.value.find((source) => source.uid === pred.value).label;
	                                }
	                                if (pred.valueType === 'entity') {
	                                    if (pred.value === null) {
	                                        return 'Not set';
	                                    }
	                                    return this.props.dataStore.dataStore.all.entity.value.find((entity) => entity.uid === pred.value).label;
	                                }
	                                return pred.value;
	                            }).join(', ');
	                        }
	                        return value;
	                    }
	                })
	            };
	        })
	            .filter((row) => {
	            let keepRow = true;
	            this.state.columns.forEach((col, i) => {
	                if (col.filterType === 'contains' && col.filterValue.length > 0 && col.predicate !== null) {
	                    if (row.columns[i].toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1) {
	                        keepRow = false;
	                    }
	                }
	                if (col.filterType === 'exists' && col.predicate !== null) {
	                    if (row.columns[i].length === 0) {
	                        keepRow = false;
	                    }
	                }
	                if (col.filterType === 'similar' && col.predicate !== null && col.filterValue.length > 0) {
	                    if (new lev(row.columns[i], col.filterValue).distance >= col.filterValue.length + 2) {
	                        keepRow = false;
	                    }
	                }
	            });
	            return keepRow;
	        })
	            .sort((row1, row2) => {
	            let score = 0;
	            this.state.columns.forEach((col, i) => {
	                if (col.sort !== 'none' && row1.columns[i] !== row2.columns[i]) {
	                    score += (row1.columns[i] > row2.columns[i] ? 1 : -1) * (Math.pow(10, 3 - i)) * (col.sort === 'asc' ? -1 : 1);
	                }
	            });
	            return score;
	        });
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header entity' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("h2", null,
	                            "All Entities ",
	                            React.createElement("i", { className: 'fa fa-plus-circle add button', title: 'Add new entity', "aria-hidden": 'true', onClick: this.addNew.bind(this) }))),
	                    React.createElement("div", { className: 'sub-toolbar' },
	                        React.createElement("i", { className: 'fa fa-folder-open-o', "aria-hidden": 'true', onClick: this.addViewTab.bind(this) }))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'entity selected' }, "LIST")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement("table", { className: 'table' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("td", null, "#"),
	                            React.createElement("td", null, "Label"),
	                            React.createElement("td", null, "Type"),
	                            customColumns(predicates, this.state.columns, this.updateColumnParams.bind(this), this.rotateSort.bind(this))),
	                        React.createElement("tr", null,
	                            React.createElement("td", null),
	                            React.createElement("td", null),
	                            React.createElement("td", null,
	                                React.createElement(ComboDropdown_1.ComboDropdown, { value: this.state.entityType, typeName: 'entity type', allowNew: false, setValue: (entityType) => this.setState({ entityType }), options: entityTypeOptions, createNewValue: lodash_1.noop, compact: true })),
	                            this.state.columns.map((col, id) => (React.createElement("td", { key: `col-${id}` },
	                                React.createElement("div", { className: 'flex-fill' },
	                                    React.createElement("div", null,
	                                        React.createElement("select", { value: col.filterType, className: 'padded', onChange: (e) => this.updateColumnParams(id, 'f', e.target.value) },
	                                            React.createElement("option", { value: 'any' }, "Any"),
	                                            React.createElement("option", { value: 'exists' }, "Exists"),
	                                            React.createElement("option", { value: 'contains' }, "Contains"),
	                                            React.createElement("option", { value: 'similar' }, "Similar"))),
	                                    React.createElement("div", null,
	                                        React.createElement("input", { type: 'text', disabled: col.filterType === 'any' || col.filterType === 'exists', onChange: (e) => this.updateColumnParams(id, 'v', e.target.value), value: col.filterValue })))))))),
	                    React.createElement("tbody", null, tableData.map((row) => (React.createElement("tr", { key: `entity-${row.uid}` },
	                        React.createElement("td", null, row.uid),
	                        React.createElement("td", null,
	                            row.label,
	                            " ",
	                            React.createElement(AddTabButton_1.AddTabButton, { uid: row.uid, tabType: 'entity' })),
	                        React.createElement("td", null, row.entityType ? row.entityType.label : ''),
	                        [0, 1, 2].map((id) => (React.createElement("td", { key: `col-val-${id}` }, row.columns[id])))))))))));
	    }
	};
	EntityList.contextTypes = {
	    router: React.PropTypes.object.isRequired
	};
	EntityList = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [Object])
	], EntityList);
	exports.EntityList = EntityList;


/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("levenshtein");

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const AddTabButton_1 = __webpack_require__(45);
	const mobx_react_1 = __webpack_require__(23);
	const SearchBar_1 = __webpack_require__(34);
	let PredicateList = class PredicateList extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            filterFunc: () => true
	        };
	    }
	    addNew() {
	        const a = {
	            name: 'predicate',
	            complete: () => {
	            },
	            cancel: () => { console.log('cancel'); },
	            settings: {
	                initialName: ''
	            }
	        };
	        this.props.modalController.addModal(a);
	    }
	    render() {
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header predicate' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("h2", null,
	                            "All Properties ",
	                            React.createElement("i", { className: 'fa fa-plus-circle add button', title: 'Add new property', "aria-hidden": 'true', onClick: this.addNew.bind(this) })))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'predicate selected' }, "LIST")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement(SearchBar_1.SearchBar, { getValue: (a) => a.label, setFilterFunc: (f) => this.setState({ filterFunc: f }) }),
	                React.createElement("table", { className: 'table gap' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("td", null, "#"),
	                            React.createElement("td", null, "Label"),
	                            React.createElement("td", null, "Domain"),
	                            React.createElement("td", null, "Range"),
	                            React.createElement("td", null, "Uses"))),
	                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.predicate.value.filter(this.state.filterFunc).map((predicate) => {
	                        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === predicate.domain);
	                        const rangeType = predicate.rangeIsReference ?
	                            this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === predicate.range) :
	                            predicate.range;
	                        return (React.createElement("tr", { key: `predicate-${predicate.uid}` },
	                            React.createElement("td", null,
	                                predicate.uid,
	                                " ",
	                                React.createElement(AddTabButton_1.AddTabButton, { uid: predicate.uid, tabType: 'predicate' })),
	                            React.createElement("td", null, predicate.label),
	                            React.createElement("td", null, entityType ? entityType.label : ''),
	                            React.createElement("td", null, predicate.rangeIsReference ? rangeType ? rangeType.label : '' : rangeType),
	                            React.createElement("td", null, predicate.uses)));
	                    }))))));
	    }
	};
	PredicateList = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], PredicateList);
	exports.PredicateList = PredicateList;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const AddTabButton_1 = __webpack_require__(45);
	const mobx_react_1 = __webpack_require__(23);
	const SearchBar_1 = __webpack_require__(34);
	const RecursiveTree_1 = __webpack_require__(62);
	let SourceList = class SourceList extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            filterFunc: () => true,
	            mode: 'list'
	        };
	    }
	    addNew() {
	        const a = {
	            name: 'source',
	            complete: () => {
	            },
	            cancel: () => { console.log('cancel'); },
	            settings: {}
	        };
	        this.props.modalStore.addModal(a);
	    }
	    render() {
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header source' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("h2", null,
	                            "All Sources ",
	                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new source', onClick: this.addNew.bind(this) })))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'source ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: () => this.setState({ mode: 'list' }) }, "LIST"),
	                        React.createElement("div", { className: 'source ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: () => this.setState({ mode: 'tree' }) }, "TREE")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement(SearchBar_1.SearchBar, { getValue: (a) => a.label, setFilterFunc: (f) => this.setState({ filterFunc: f }) }),
	                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("td", null, "#"),
	                            React.createElement("td", null, "Name"),
	                            React.createElement("td", null, "Parent"))),
	                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.source.value.filter(this.state.filterFunc).map((source) => {
	                        return (React.createElement("tr", { key: `source-${source.uid}` },
	                            React.createElement("td", null,
	                                source.uid,
	                                " ",
	                                React.createElement(AddTabButton_1.AddTabButton, { uid: source.uid, tabType: 'source' })),
	                            React.createElement("td", null, source.label),
	                            React.createElement("td", null, source.parent)));
	                    })))) : (React.createElement("div", { className: 'tree-root' },
	                    React.createElement(RecursiveTree_1.RecursiveTree, { data: this.props.dataStore.dataStore.all.source.value, tabType: 'source', parentId: null, dataStore: this.props.dataStore }))))));
	    }
	};
	SourceList = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], SourceList);
	exports.SourceList = SourceList;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	const AddTabButton_1 = __webpack_require__(45);
	class RecursiveTree extends React.Component {
	    constructor() {
	        super();
	        this.state = { collapsed: false };
	    }
	    render() {
	        const filtered = this.props.data.filter((datum) => datum.parent === this.props.parentId);
	        if (filtered.length === 0) {
	            return null;
	        }
	        return (React.createElement("div", null, filtered.map((item) => (React.createElement("div", { key: item.label },
	            React.createElement("div", { className: 'tree-label', onClick: () => this.setState({ collapsed: !this.state.collapsed }) },
	                "- ",
	                item.label,
	                " ",
	                React.createElement(AddTabButton_1.AddTabButton, { uid: item.uid, tabType: this.props.tabType })),
	            !this.state.collapsed ? (React.createElement("div", { className: 'tree-children' },
	                React.createElement(RecursiveTree, { dataStore: this.props.dataStore, data: this.props.data, tabType: this.props.tabType, parentId: item.uid }))) : null)))));
	    }
	}
	exports.RecursiveTree = RecursiveTree;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const AddTabButton_1 = __webpack_require__(45);
	const SearchBar_1 = __webpack_require__(34);
	const RecursiveTree_1 = __webpack_require__(62);
	const mobx_react_1 = __webpack_require__(23);
	let EntityTypeList = class EntityTypeList extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            filterFunc: () => true,
	            mode: 'list'
	        };
	    }
	    addNew() {
	        const a = {
	            name: 'entity_type',
	            complete: () => {
	            },
	            cancel: () => { console.log('cancel'); },
	            settings: {}
	        };
	        this.props.modalStore.addModal(a);
	    }
	    render() {
	        return (React.createElement("div", { className: 'workspace-editor' },
	            React.createElement("header", { className: 'editor-header entity_type' },
	                React.createElement("div", { className: 'primary-toolbar' },
	                    React.createElement("div", { className: 'main-toolbar' },
	                        React.createElement("h2", null,
	                            "All Entity Types ",
	                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new entity type', onClick: this.addNew.bind(this) })))),
	                React.createElement("div", { className: 'secondary-toolbar' },
	                    React.createElement("div", { className: 'tab-bar' },
	                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: () => this.setState({ mode: 'list' }) }, "LIST"),
	                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: () => this.setState({ mode: 'tree' }) }, "TREE")))),
	            React.createElement("section", { className: 'editor-body' },
	                React.createElement(SearchBar_1.SearchBar, { getValue: (a) => a.label, setFilterFunc: (f) => this.setState({ filterFunc: f }) }),
	                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("td", null, "#"),
	                            React.createElement("td", null, "Name"),
	                            React.createElement("td", null, "Parent"),
	                            React.createElement("td", null, "Description"))),
	                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.entity_type.value.filter(this.state.filterFunc).map((entityType) => {
	                        return (React.createElement("tr", { key: `entityType-${entityType.uid}` },
	                            React.createElement("td", null,
	                                entityType.uid,
	                                " ",
	                                React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' })),
	                            React.createElement("td", null, entityType.label),
	                            React.createElement("td", null, entityType.parent),
	                            React.createElement("td", null, entityType.description)));
	                    })))) : (React.createElement("div", { className: 'tree-root' },
	                    React.createElement(RecursiveTree_1.RecursiveTree, { data: this.props.dataStore.dataStore.all.entity_type.value, tabType: 'entity_type', parentId: null, dataStore: this.props.dataStore }))))));
	    }
	};
	EntityTypeList = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], EntityTypeList);
	exports.EntityTypeList = EntityTypeList;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Toast controller
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	class Toast extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            toasts: [],
	            nextId: 0
	        };
	    }
	    addToast(title, message, level = 'warning', lifeTime = 3000) {
	        const id = this.state.nextId;
	        this.setState({
	            toasts: this.state.toasts.concat([{ title, message, level, lifeTime, id }]),
	            nextId: id + 1
	        });
	        setTimeout(() => {
	            this.setState({
	                toasts: this.state.toasts.filter((toast) => toast.id !== id)
	            });
	        }, lifeTime);
	    }
	    render() {
	        return (React.createElement("span", null, this.state.toasts.map((toast, i) => (React.createElement("div", { key: `toast-${toast.id}`, style: { bottom: (1 + 7 * i) + 'em' }, className: `toast ${toast.level}` },
	            React.createElement("div", { className: 'title' }, toast.title),
	            React.createElement("div", { className: 'message' }, toast.message))))));
	    }
	}
	exports.Toast = Toast;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const DataStore_1 = __webpack_require__(66);
	const immutable_1 = __webpack_require__(67);
	const react_sortable_hoc_1 = __webpack_require__(22);
	const mobx_1 = __webpack_require__(68);
	const lodash_1 = __webpack_require__(21);
	const moment = __webpack_require__(42);
	class DataController {
	    constructor(api) {
	        this.api = api;
	        this.dataStore = lodash_1.cloneDeep(DataStore_1.emptyDataStore);
	        this.tabs = [];
	        if (typeof window !== 'undefined') {
	            const tabString = window.localStorage.getItem('open_tabs');
	            if (tabString !== null) {
	                this.tabs = JSON.parse(tabString);
	            }
	        }
	    }
	    // checks that the page exists and adds it to tabs if necessery
	    enterPage(workspace, uid, other) {
	        if (!lodash_1.isNaN(uid)) {
	            if (lodash_1.find(this.tabs, (tab) => tab.tabType === workspace && tab.uid == uid) === undefined) {
	                this.tabs = this.tabs.concat([{ tabType: workspace, uid: uid, tabClass: 'item' }]);
	            }
	        }
	        return this.update();
	    }
	    loadTabData(tab) {
	        if (tab.tabClass !== 'item') {
	            return Promise.resolve(new falcon_core_1.Entity());
	        }
	        switch (tab.tabType) {
	            case 'entity':
	                return Promise.all([
	                    this.api.getItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, tab.uid),
	                    this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { entity: tab.uid }),
	                    this.api.getCollection(falcon_core_1.Record, ApiService_1.AppUrls.record, { value_type: 'entity', value_entity: tab.uid })
	                ]).then(([entity, records, referenceRecords]) => ({ entity, records, referenceRecords }));
	            case 'predicate':
	                return this.api.getItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, tab.uid);
	            case 'entity_type':
	                return this.api.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, tab.uid);
	            case 'source':
	                return Promise.all([
	                    this.api.getItem(falcon_core_1.Source, ApiService_1.AppUrls.source, tab.uid),
	                    this.api.getCollection(falcon_core_1.SourceElement, ApiService_1.AppUrls.source_element, { source: tab.uid })
	                ]).then(([source, source_element]) => ({ source, source_element }));
	            default:
	                throw new Error('Unexpected tab type requested');
	        }
	    }
	    update() {
	        return __awaiter(this, void 0, void 0, function* () {
	            // LOAD TABS
	            const groupedTabs = lodash_1.groupBy(this.tabs, 'tabType');
	            if (lodash_1.find(this.tabs, (tab) => tab.tabType === 'source' && tab.uid === this.defaultSource) === undefined) {
	                this.defaultSource = null;
	            }
	            const tabPromise = Promise.all(Object.keys(groupedTabs).map((tabType) => Promise.all(groupedTabs[tabType].map((tab) => this.loadTabData(tab)
	                .then((value) => {
	                return { [`${tab.tabType}-${tab.uid}`]: { value, lastUpdate: moment() } };
	            })))
	                .then((tabData) => {
	                return { [tabType]: immutable_1.Map(Object.assign({}, ...tabData)) };
	            })));
	            // load lists of data commonly required by views
	            const allPromise = Promise.all([
	                this.api.getCollection(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, {}),
	                this.api.getCollection(falcon_core_1.Source, ApiService_1.AppUrls.source, {}),
	                this.api.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, {}),
	                this.api.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {}),
	                this.api.getItem(falcon_core_1.ElementSet, ApiService_1.AppUrls.element_set, 1)
	            ])
	                .then(([predicates, sources, entities, entityType, dublinCore]) => {
	                return {
	                    predicate: { value: predicates, lastUpdate: moment() },
	                    source: { value: sources, lastUpdate: moment() },
	                    entity: { value: entities, lastUpdate: moment() },
	                    entity_type: { value: entityType, lastUpdate: moment() },
	                    dublinCore: { value: dublinCore, lastUpdate: moment() }
	                };
	            });
	            return Promise.all([tabPromise, allPromise])
	                .then(mobx_1.action(([tabsArray, all]) => {
	                const tabs = Object.assign({}, ...tabsArray);
	                this.dataStore.tabs = tabs;
	                this.dataStore.all = all;
	                return true;
	            }));
	        });
	    }
	    /*
	    *
	    *    API
	    *
	    */
	    getItem(obj, baseUrl, uid) {
	        return this.api.getItem.apply(this, arguments);
	    }
	    getCollection(obj, baseUrl, params) {
	        return this.api.getCollection.apply(this, arguments);
	    }
	    postItem(obj, baseUrl, data) {
	        return this.api.postItem.apply(this, arguments).then((result) => this.update().then(() => result));
	    }
	    putItem(obj, baseUrl, uid, data) {
	        return this.api.putItem.apply(this, arguments).then((result) => this.update().then(() => result));
	    }
	    //TODO: patch item takes a subset of an objects properties. This is currently being looked at in TS in the
	    //context of the 'setState' function in react
	    patchItem(obj, baseUrl, uid, data) {
	        return this.api.patchItem.apply(this, arguments).then((result) => this.update().then(() => result));
	    }
	    delItem(obj, baseUrl, uid) {
	        return this.api.delItem.apply(this, arguments).then((result) => this.update().then(() => result));
	    }
	    query(graphQLQuery) {
	        return this.api.query.apply(this, arguments);
	    }
	    getStats() {
	        return this.api.getStats.apply(this, arguments);
	    }
	    /*
	    *
	    *    TABS
	    *
	    */
	    createTab(tabType, uid, tabClass, data, query) {
	        // don't add a tab if it already exists
	        if (lodash_1.find(this.tabs, (tab) => tab.tabType === tabType && tab.uid == uid) === undefined) {
	            this.tabs.unshift({ tabType, uid, data, tabClass, query });
	            this.saveTabs();
	            this.update();
	        }
	    }
	    updateTab(tabType, uid, data) {
	        const tabs = lodash_1.cloneDeep(this.tabs);
	        const tabId = lodash_1.findIndex(tabs, (tab) => tab.tabType === tabType && tab.uid === uid);
	        if (tabId !== -1) {
	            tabs[tabId].data = data;
	            this.tabs = tabs;
	        }
	    }
	    closeTab(tabType, uid) {
	        this.tabs = this.tabs.filter((a) => a.tabType !== tabType || a.uid !== uid);
	        this.saveTabs();
	        this.update();
	    }
	    saveTabs() {
	        const tabsString = JSON.stringify(this.tabs);
	        window.localStorage.setItem('open_tabs', tabsString);
	    }
	    clearAllTabs() {
	        this.tabs = [];
	        this.saveTabs();
	        this.update();
	    }
	    reorderTabs(data) {
	        this.tabs = react_sortable_hoc_1.arrayMove(this.tabs, data.oldIndex, data.newIndex);
	        this.saveTabs();
	    }
	}
	__decorate([
	    mobx_1.observable,
	    __metadata("design:type", Object)
	], DataController.prototype, "dataStore", void 0);
	__decorate([
	    mobx_1.observable,
	    __metadata("design:type", Array)
	], DataController.prototype, "tabs", void 0);
	__decorate([
	    mobx_1.observable,
	    __metadata("design:type", Object)
	], DataController.prototype, "defaultSource", void 0);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [String, Number, Object]),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "enterPage", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", []),
	    __metadata("design:returntype", Promise)
	], DataController.prototype, "update", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [String, Number, String, Object, Object]),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "createTab", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [String, Number, Object]),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "updateTab", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [String, Number]),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "closeTab", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", []),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "saveTabs", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", []),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "clearAllTabs", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [Object]),
	    __metadata("design:returntype", void 0)
	], DataController.prototype, "reorderTabs", null);
	exports.DataController = DataController;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const immutable_1 = __webpack_require__(67);
	const falcon_core_1 = __webpack_require__(8);
	exports.emptyDataStore = {
	    all: {
	        entity: { value: [], lastUpdate: null },
	        entity_type: { value: [], lastUpdate: null },
	        predicate: { value: [], lastUpdate: null },
	        source: { value: [], lastUpdate: null },
	        dublinCore: { value: new falcon_core_1.ElementSet(), lastUpdate: null }
	    },
	    records: immutable_1.Map(),
	    tabs: {
	        entity: immutable_1.Map(),
	        entity_type: immutable_1.Map(),
	        predicate: immutable_1.Map(),
	        source: immutable_1.Map()
	    },
	    lockedSource: null
	};
	exports.emptyTabs = [
	    { entity: immutable_1.Map() },
	    { entity_type: immutable_1.Map() },
	    { predicate: immutable_1.Map() },
	    { source: immutable_1.Map()
	    }
	];


/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = require("immutable");

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = require("mobx");

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview <Description Missing>
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const lodash_1 = __webpack_require__(21);
	const CreatePredicate_1 = __webpack_require__(70);
	const CreateRecord_1 = __webpack_require__(72);
	const CreatePresetRecord_1 = __webpack_require__(73);
	const CreateSource_1 = __webpack_require__(74);
	const CreateEntity_1 = __webpack_require__(75);
	const CreateEntityType_1 = __webpack_require__(76);
	const ConflictResolution_1 = __webpack_require__(77);
	const mobx_1 = __webpack_require__(68);
	class ModalStore {
	    constructor() {
	        this.modalQueue = [];
	    }
	    // might be @computed?
	    get currentModal() {
	        if (this.modalQueue.length === 0) {
	            return null;
	        }
	        const sharedProps = {
	            complete: this.modalComplete.bind(this),
	            cancel: this.modalCancel.bind(this)
	        };
	        switch (this.modalQueue[0].name) {
	            case 'predicate':
	                return (React.createElement(CreatePredicate_1.CreatePredicate, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'record':
	                return (React.createElement(CreateRecord_1.CreateRecord, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'preset_record':
	                return (React.createElement(CreatePresetRecord_1.CreatePresetRecord, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'source':
	                return (React.createElement(CreateSource_1.CreateSource, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'entity':
	                return (React.createElement(CreateEntity_1.CreateEntity, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'entity_type':
	                return (React.createElement(CreateEntityType_1.CreateEntityType, __assign({}, sharedProps, this.modalQueue[0].settings)));
	            case 'conflict_resolution':
	                return (React.createElement(ConflictResolution_1.ConflictResolution, __assign({}, sharedProps, this.modalQueue[0].settings)));
	        }
	        return null;
	    }
	    addModal(def) {
	        this.modalQueue.unshift(def);
	    }
	    modalComplete(data) {
	        if (this.modalQueue.length === 0) {
	            throw new Error('Attempted to complete non-existent modal');
	        }
	        this.modalQueue[0].complete(data);
	        if (this.modalQueue.length > 0) {
	            this.modalQueue = lodash_1.tail(this.modalQueue);
	        }
	    }
	    modalCancel() {
	        if (this.modalQueue.length === 0) {
	            throw new Error('Attempted to cancel non-existent modal');
	        }
	        this.modalQueue[0].cancel();
	        this.modalQueue = [];
	    }
	}
	__decorate([
	    mobx_1.observable,
	    __metadata("design:type", Array)
	], ModalStore.prototype, "modalQueue", void 0);
	__decorate([
	    mobx_1.computed,
	    __metadata("design:type", Object),
	    __metadata("design:paramtypes", [])
	], ModalStore.prototype, "currentModal", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [Object]),
	    __metadata("design:returntype", void 0)
	], ModalStore.prototype, "addModal", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", [Object]),
	    __metadata("design:returntype", void 0)
	], ModalStore.prototype, "modalComplete", null);
	__decorate([
	    mobx_1.action,
	    __metadata("design:type", Function),
	    __metadata("design:paramtypes", []),
	    __metadata("design:returntype", void 0)
	], ModalStore.prototype, "modalCancel", null);
	exports.ModalStore = ModalStore;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const PredicateDescription_1 = __webpack_require__(54);
	const falcon_core_1 = __webpack_require__(8);
	const literalTypes_1 = __webpack_require__(55);
	const ApiService_1 = __webpack_require__(6);
	const mobx_react_1 = __webpack_require__(23);
	let CreatePredicate = class CreatePredicate extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            name: '',
	            domain: { key: '', value: '' },
	            range: { key: '', value: '' },
	            domainOptions: [],
	            rangeOptions: []
	        };
	    }
	    componentWillMount() {
	        this.setState({ name: this.props.initialName });
	    }
	    componentDidMount() {
	        if (this.props.initialDomain !== undefined) {
	            this.props.dataStore.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.initialDomain)
	                .then((result) => {
	                if (result.uid === null) {
	                    throw new Error('Unexpected null uid');
	                }
	                this.setState({
	                    domain: { key: result.label, value: result.uid.toString() },
	                    domainOptions: [
	                        { key: result.label, value: result.uid.toString() }
	                    ].concat(result.parents.map((entityType) => {
	                        if (entityType.uid === null) {
	                            throw new Error('Unexpected null uid');
	                        }
	                        return { key: entityType.label, value: entityType.uid.toString() };
	                    }))
	                });
	            });
	        }
	        const results = this.props.dataStore.dataStore.all.entity_type.value;
	        const entityTypeMap = results.map((entityType) => {
	            if (entityType.uid === null) {
	                throw new Error('Unexpected null uid');
	            }
	            return { key: entityType.label, value: entityType.uid.toString() };
	        });
	        if (this.props.initialDomain === undefined) {
	            this.setState({ domainOptions: entityTypeMap });
	        }
	        this.setState({
	            rangeOptions: literalTypes_1.literalTypes.map((lit) => ({ key: lit.label, value: lit.value, meta: 'literal' })).concat(entityTypeMap)
	        });
	    }
	    create() {
	        const newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, {
	            name: this.state.name,
	            domain: this.state.domain.value,
	            range: this.state.range.value,
	            rangeIsReference: this.state.range.meta !== 'literal'
	        });
	        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate)
	            .then((result) => {
	            newPredicate.uid = result[0];
	            this.props.complete(newPredicate);
	        });
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null,
	                React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
	                " Create Property"),
	            React.createElement("label", { className: 'small' }, "Name"),
	            React.createElement("input", { type: 'text', className: 'gap', ref: (a) => { if (a !== null)
	                    a.focus(); }, value: this.state.name, onChange: (e) => this.setState({ name: e.target.value }) }),
	            React.createElement(PredicateDescription_1.PredicateDescription, { domain: this.state.domain, range: this.state.range, domainChanged: (s) => this.setState({ domain: s }), rangeChanged: (s) => this.setState({ range: s }), domainOptions: this.state.domainOptions, rangeOptions: this.state.rangeOptions, mode: 'editAll' }),
	            React.createElement("div", { className: 'modal-toolbar' },
	                React.createElement("button", { onClick: this.props.cancel, className: 'pull-left' }, "Cancel"),
	                React.createElement("button", { onClick: this.create.bind(this), className: 'pull-right' }, "Create Property"))));
	    }
	};
	CreatePredicate = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreatePredicate);
	exports.CreatePredicate = CreatePredicate;
	;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	const React = __webpack_require__(2);
	class Overlay extends React.Component {
	    render() {
	        return (React.createElement("div", { className: 'full-page-overlay' },
	            React.createElement("div", { className: 'overlay-container' }, this.props.children)));
	    }
	}
	exports.Overlay = Overlay;
	;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const ComboDropdown_1 = __webpack_require__(19);
	const mobx_react_1 = __webpack_require__(23);
	let CreateRecord = class CreateRecord extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            comboValue: { key: '', value: '' },
	            searchValue: ''
	        };
	    }
	    componentDidMount() {
	        this.refs['comboDropDown'].refs['comboDropDownInputBox'].focus();
	    }
	    createNewPredicate() {
	        const modalDef = {
	            name: 'predicate',
	            complete: (data) => {
	                console.log('Predicate editor called complete');
	                this.setComboValue({ key: data.label, value: data.uid === null ? null : data.uid.toString(), meta: data });
	            },
	            cancel: () => {
	                console.log('Predicate editor called cancel');
	            },
	            settings: {
	                initialName: this.state.searchValue,
	                initialDomain: this.props.entityType
	            }
	        };
	        this.props.modalStore.addModal(modalDef);
	    }
	    setComboValue(opt) {
	        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
	            predicate: opt.meta.uid,
	            entity: this.props.entityUid,
	            valueType: opt.meta.rangeIsReference ? 'entity' : opt.meta.range,
	            score: 3,
	            source: this.props.dataStore.defaultSource
	        }))
	            .then((result) => this.props.complete(result))
	            .catch(this.props.cancel);
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null, "Create Record"),
	            React.createElement(ComboDropdown_1.ComboDropdown, { ref: 'comboDropDown', options: this.props.options, typeName: 'predicate', value: this.state.comboValue, setValue: this.setComboValue.bind(this), createNewValue: this.createNewPredicate.bind(this), updateSearchString: (s) => this.setState({ searchValue: s }) })));
	    }
	};
	CreateRecord = __decorate([
	    mobx_react_1.inject('modalStore', 'dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreateRecord);
	exports.CreateRecord = CreateRecord;
	;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const mobx_react_1 = __webpack_require__(23);
	let CreatePresetRecord = CreatePresetRecord_1 = class CreatePresetRecord extends React.Component {
	    constructor() {
	        super();
	        this.state = {};
	    }
	    componentDidMount() {
	        if (CreatePresetRecord_1.openEntityDialog) {
	            CreatePresetRecord_1.openEntityDialog = false;
	            this.createNewEntity();
	        }
	        else {
	            CreatePresetRecord_1.openEntityDialog = true;
	        }
	    }
	    createNewEntity() {
	        const modalDef = {
	            name: 'entity',
	            complete: (data) => {
	                const isMentioned = this.props.dataStore.dataStore.all.predicate.value.find((pred) => pred.label === 'is mentioned');
	                this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
	                    predicate: isMentioned.uid,
	                    entity: data[0],
	                    valueType: 'source',
	                    source: this.props.source.uid,
	                    score: 3
	                }))
	                    .then((result) => {
	                    this.props.complete(result);
	                })
	                    .catch(this.props.cancel);
	            },
	            cancel: () => {
	            },
	            settings: {}
	        };
	        this.props.modalStore.addModal(modalDef);
	    }
	    render() {
	        return null;
	    }
	};
	CreatePresetRecord.openEntityDialog = true;
	CreatePresetRecord = CreatePresetRecord_1 = __decorate([
	    mobx_react_1.inject('dataStore', 'modalStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreatePresetRecord);
	exports.CreatePresetRecord = CreatePresetRecord;
	;
	var CreatePresetRecord_1;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const mobx_react_1 = __webpack_require__(23);
	const mousetrap = __webpack_require__(50);
	let CreateSource = class CreateSource extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            internalValue: ''
	        };
	    }
	    componentWillMount() {
	        this.setState({ internalValue: this.props.initialValue });
	    }
	    createSource() {
	        this.props.dataStore.postItem(falcon_core_1.Source, ApiService_1.AppUrls.source, falcon_core_1.Serializer.fromJson(falcon_core_1.Source, {
	            name: this.state.internalValue
	        }))
	            .then(this.props.complete);
	    }
	    inputRef(val) {
	        if (val !== null) {
	            val.focus();
	            this.keyboardShortcuts = new mousetrap(val);
	            this.keyboardShortcuts.bind('return', this.createSource.bind(this));
	            this.keyboardShortcuts.bind('escape', this.props.cancel);
	        }
	        else {
	            this.keyboardShortcuts.unbind('return');
	            this.keyboardShortcuts.unbind('escape');
	        }
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null, "Create Source"),
	            React.createElement("label", { className: 'small' }, "Name"),
	            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: (e) => this.setState({ internalValue: e.target.value }) }),
	            React.createElement("button", { onClick: () => this.props.cancel(), className: 'pull-left' }, "Cancel"),
	            React.createElement("button", { onClick: this.createSource.bind(this), className: 'pull-right' }, "Create Source")));
	    }
	};
	CreateSource.defaultProps = {
	    initialValue: ''
	};
	CreateSource = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreateSource);
	exports.CreateSource = CreateSource;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const ComboDropdown_1 = __webpack_require__(19);
	const lodash_1 = __webpack_require__(21);
	const mobx_react_1 = __webpack_require__(23);
	let CreateEntity = class CreateEntity extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            label: '',
	            entityType: { key: '', value: '' },
	            allEntityTypes: []
	        };
	    }
	    componentWillMount() {
	        this.props.dataStore.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {})
	            .then((allEntityTypes) => {
	            if (this.props.initialType !== undefined) {
	                const initialType = allEntityTypes.find((et) => et.uid === this.props.initialType);
	                this.setState({
	                    entityType: { key: initialType.label, value: initialType.uid.toString() }
	                });
	            }
	            this.setState({ allEntityTypes });
	        });
	    }
	    CreateEntity() {
	        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
	            label: this.state.label,
	            entityType: this.state.entityType.value
	        }))
	            .then(this.props.complete);
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null, "Create Entity"),
	            React.createElement("label", { className: 'small' }, "Label"),
	            React.createElement("input", { type: 'text', value: this.state.label, ref: (a) => { if (a !== null)
	                    a.focus(); }, name: 'new-entity-name', className: 'gap', onChange: (e) => this.setState({ label: e.target.value }) }),
	            React.createElement("label", { className: 'small' }, "Type"),
	            React.createElement(ComboDropdown_1.ComboDropdown, { options: this.state.allEntityTypes.map((t) => ({ key: t.label, value: t.uid.toString() })), typeName: 'entity type', value: this.state.entityType, setValue: (entityType) => this.setState({ entityType }), createNewValue: lodash_1.noop, allowNew: false }),
	            React.createElement("button", { name: 'cancel-modal', onClick: () => this.props.cancel(), className: 'pull-left' }, "Cancel"),
	            React.createElement("button", { name: 'create-entity', onClick: this.CreateEntity.bind(this), className: 'pull-right' }, "Create Entity")));
	    }
	};
	CreateEntity = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreateEntity);
	exports.CreateEntity = CreateEntity;
	;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const falcon_core_1 = __webpack_require__(8);
	const ApiService_1 = __webpack_require__(6);
	const mobx_react_1 = __webpack_require__(23);
	const mousetrap = __webpack_require__(50);
	let CreateEntityType = class CreateEntityType extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            internalValue: ''
	        };
	    }
	    createEntityType() {
	        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, {
	            label: this.state.internalValue
	        }))
	            .then(this.props.complete);
	    }
	    inputRef(val) {
	        if (val !== null) {
	            val.focus();
	            this.keyboardShortcuts = new mousetrap(val);
	            this.keyboardShortcuts.bind('return', this.createEntityType.bind(this));
	            this.keyboardShortcuts.bind('escape', this.props.cancel);
	        }
	        else {
	            this.keyboardShortcuts.unbind('return');
	        }
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null, "Create Entity Type"),
	            React.createElement("label", { className: 'small' }, "Name"),
	            React.createElement("input", { type: 'text', value: this.state.internalValue, ref: this.inputRef.bind(this), onChange: (e) => this.setState({ internalValue: e.target.value }) }),
	            React.createElement("button", { onClick: () => this.props.cancel(), className: 'pull-left' }, "Cancel"),
	            React.createElement("button", { onClick: this.createEntityType.bind(this), className: 'pull-right' }, "Create Entity Type")));
	    }
	};
	CreateEntityType = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], CreateEntityType);
	exports.CreateEntityType = CreateEntityType;
	;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Sidebar for editor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.1.0
	 */
	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	const React = __webpack_require__(2);
	const Overlay_1 = __webpack_require__(71);
	const mobx_react_1 = __webpack_require__(23);
	let ConflictResolution = class ConflictResolution extends React.Component {
	    constructor() {
	        super();
	        this.state = {
	            label: '',
	            entityType: { key: '', value: '' },
	            allEntityTypes: []
	        };
	    }
	    render() {
	        return (React.createElement(Overlay_1.Overlay, null,
	            React.createElement("h2", null,
	                React.createElement("i", { className: 'fa fa-exclamation-triangle warning' }),
	                " Conflict: ",
	                this.props.message),
	            this.props.conflictingItems.record !== undefined && this.props.conflictingItems.record.length > 0 ? (React.createElement("span", null,
	                React.createElement("p", null, "The following records conflict with your request change:"),
	                React.createElement("table", { className: 'table' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("th", null, "Entity"),
	                            React.createElement("th", null, "Predicate"),
	                            React.createElement("th", null, "Value"))),
	                    React.createElement("tbody", null, this.props.conflictingItems.record.map((record) => {
	                        const entityName = this.props.dataStore.dataStore.all.entity.value
	                            .find((entity) => entity.uid == record.entity).label;
	                        const predicateName = this.props.dataStore.dataStore.all.predicate.value
	                            .find((predicate) => predicate.uid == record.predicate).label;
	                        return (React.createElement("tr", { key: `row-${record.uid}` },
	                            React.createElement("td", null, entityName),
	                            React.createElement("td", null, predicateName),
	                            React.createElement("td", null, record.value)));
	                    }))))) : null,
	            this.props.conflictingItems.entity !== undefined && this.props.conflictingItems.entity.length > 0 ? (React.createElement("span", null,
	                React.createElement("p", null, "The following entities conflict with your request change:"),
	                React.createElement("table", { className: 'table' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("th", null, "Entity"))),
	                    React.createElement("tbody", null, this.props.conflictingItems.entity.map((entity) => {
	                        return (React.createElement("tr", { key: `row-${entity.uid}` },
	                            React.createElement("td", null, entity.label)));
	                    }))))) : null,
	            this.props.conflictingItems.entityType !== undefined && this.props.conflictingItems.entityType.length > 0 ? (React.createElement("span", null,
	                React.createElement("p", null, "The following entity types conflict with your request change:"),
	                React.createElement("table", { className: 'table' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("th", null, "Entity Type"))),
	                    React.createElement("tbody", null, this.props.conflictingItems.entityType.map((entityType) => {
	                        return (React.createElement("tr", { key: `row-${entityType.uid}` },
	                            React.createElement("td", null, entityType.label)));
	                    }))))) : null,
	            this.props.conflictingItems.source !== undefined && this.props.conflictingItems.source.length > 0 ? (React.createElement("span", null,
	                React.createElement("p", null, "The following sources conflict with your request change:"),
	                React.createElement("table", { className: 'table' },
	                    React.createElement("thead", null,
	                        React.createElement("tr", null,
	                            React.createElement("th", null, "Sources"))),
	                    React.createElement("tbody", null, this.props.conflictingItems.source.map((source) => {
	                        return (React.createElement("tr", { key: `row-${source.uid}` },
	                            React.createElement("td", null, source.label)));
	                    }))))) : null,
	            React.createElement("div", { className: 'block-buttons' },
	                React.createElement("button", { onClick: () => this.props.cancel() }, "Cancel"),
	                React.createElement("button", { onClick: () => this.props.complete('addToWorkspace') },
	                    React.createElement("i", { className: 'icon-list-add' }),
	                    "Cancel and add conflicting records to workspace"),
	                React.createElement("button", { onClick: () => this.props.complete('deleteAll') },
	                    React.createElement("i", { className: 'fa fa-trash' }),
	                    " Continue and delete all conflicting records"))));
	    }
	};
	ConflictResolution = __decorate([
	    mobx_react_1.inject('dataStore'),
	    mobx_react_1.observer,
	    __metadata("design:paramtypes", [])
	], ConflictResolution);
	exports.ConflictResolution = ConflictResolution;
	;


/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("mobx-react-devtools");

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Knex = __webpack_require__(80);
	const lodash_1 = __webpack_require__(21);
	const Exceptions_1 = __webpack_require__(81);
	class Database {
	    constructor(config) {
	        this.knex = Knex(config);
	    }
	    query() {
	        return this.knex;
	    }
	    select(tableName, options = '*') {
	        return this.knex.select().from(tableName);
	    }
	    loadItem(a, uid) {
	        const query = this.knex.select()
	            .from(a)
	            .where({ uid: uid })
	            .first();
	        return query.then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result);
	    }
	    loadCollection(a, params) {
	        let query = this.knex.select()
	            .from(a);
	        Object.keys(params).forEach((param) => {
	            query = query.whereIn(param, params[param]);
	        });
	        return query.then((results) => results === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : results);
	    }
	    createItem(tableName, data) {
	        // throw warning if called with uid
	        // validate that everything else has been sent
	        const withoutUid = lodash_1.omit(data, ['uid']);
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx).insert(withoutUid, 'uid').returning('uid')
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            });
	        });
	    }
	    updateItem(tableName, data) {
	        // assert - must have uid
	        // validation?
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx)
	                .where({ 'uid': data.uid })
	                .update(data)
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            });
	        });
	    }
	    deleteItem(tableName, uid) {
	        return this.knex.transaction((trx) => {
	            return this.knex(tableName).transacting(trx)
	                .where({ uid })
	                .del()
	                .then((results) => {
	                return this.checkIntegrity(trx)
	                    .then((valid) => {
	                    if (!valid) {
	                        throw new Exceptions_1.DatabaseIntegrityError();
	                    }
	                    return results;
	                });
	            });
	        });
	    }
	    getAncestorsOf(uid, tableName) {
	        return this.knex.raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
	                ancestor(uid) AS (
	                SELECT parent FROM parent_of WHERE uid=${uid}
	                UNION ALL
	                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
					SELECT * from ancestor`)
	            .then((result) => {
	            return result.filter((a) => a.uid !== null).map((a) => a.uid);
	        });
	    }
	    getChildrenOf(uid, tableName) {
	        return this.knex.raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM ${tableName}),
	                ancestor(parent) AS (
	                SELECT uid FROM parent_of WHERE uid=${uid}
	                UNION ALL
	                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
					SELECT * from ancestor`)
	            .then((result) => {
	            return result.filter((a) => a.parent !== null).map((a) => a.parent);
	        });
	    }
	    checkIntegrity(trx) {
	        return Promise.all([
	            this.knex.transacting(trx).select(this.knex.raw('SUM((records.value_type != predicates.range_type)) AS valid'))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid'),
	            this.knex.transacting(trx).select(this.knex.raw(`
	                SUM((
	
	                entities.type not in (
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
	                                ancestor(parent) AS (
	                                SELECT uid FROM parent_of WHERE uid=predicates.range_ref
	                                UNION ALL
	                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
	                                SELECT * from ancestor
	                )
	
	                )) as valid
	            `))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
	                .innerJoin('entities', 'entities.uid', 'records.value_entity')
	                .where('records.value_type', '=', 'entity'),
	            this.knex.transacting(trx).select(this.knex.raw(`
	               SUM((
	
	                entities.type not in (
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM entity_types),
	                                ancestor(parent) AS (
	                                SELECT uid FROM parent_of WHERE uid=predicates.domain
	                                UNION ALL
	                                SELECT uid FROM parent_of JOIN ancestor USING(parent) )
	                                SELECT * from ancestor
	                )
	
	                )) as valid
	            `))
	                .from('records')
	                .innerJoin('predicates', 'records.predicate', 'predicates.uid')
	                .innerJoin('entities', 'entities.uid', 'records.entity')
	        ]).then(([[a], [b], [c]]) => {
	            return (a.valid + b.valid + c.valid) === 0;
	        });
	    }
	}
	exports.Database = Database;


/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = require("knex");

/***/ },
/* 81 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	class UnprocessableEntity extends Error {
	    constructor(message, data) {
	        super(message);
	        this.data = data;
	    }
	}
	exports.UnprocessableEntity = UnprocessableEntity;
	class KeyNotFoundException extends Error {
	    constructor(message = 'Could not find the given key') {
	        super(message);
	        this.data = message;
	    }
	}
	exports.KeyNotFoundException = KeyNotFoundException;
	class CollectionNotFoundException extends Error {
	    constructor(message = 'Could not find the given collection') {
	        super(message);
	        this.data = message;
	    }
	}
	exports.CollectionNotFoundException = CollectionNotFoundException;
	class OperationNotPermittedException extends Error {
	    constructor(data) {
	        super(data.message);
	        this.data = data;
	    }
	}
	exports.OperationNotPermittedException = OperationNotPermittedException;
	class DatabaseIntegrityError extends Error {
	    constructor(message = `A database integrity constraint has been broken - your change has not been
	 submitted. This is likely due to a change which violates the property types model; please check the types of
	 what you are trying to do. Please also contact the Digital Humanities team, this error should not occur.`) {
	        super(message);
	        this.data = message;
	    }
	}
	exports.DatabaseIntegrityError = DatabaseIntegrityError;
	exports.Exceptions = {
	    UnprocessableEntity,
	    KeyNotFoundException,
	    CollectionNotFoundException,
	    OperationNotPermittedException,
	    DatabaseIntegrityError
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	const itemTypes_1 = __webpack_require__(7);
	const ServerApiService_1 = __webpack_require__(83);
	const QueryEngine_1 = __webpack_require__(85);
	const controllers_1 = __webpack_require__(89);
	exports.wrapDatabase = (db, fakeCreator) => {
	    const routes = new Map([
	        [itemTypes_1.itemTypes.element_set.machineName, new controllers_1.ElementSetController(db)],
	        [itemTypes_1.itemTypes.record.machineName, new controllers_1.RecordController(db)],
	        [itemTypes_1.itemTypes.entity_type.machineName, new controllers_1.EntityTypeController(db)],
	        [itemTypes_1.itemTypes.entity.machineName, new controllers_1.EntityController(db)],
	        [itemTypes_1.itemTypes.predicate.machineName, new controllers_1.PredicateController(db)],
	        [itemTypes_1.itemTypes.source.machineName, new controllers_1.SourceController(db)],
	        [itemTypes_1.itemTypes.element.machineName, new controllers_1.ElementController(db)],
	        [itemTypes_1.itemTypes.source_element.machineName, new controllers_1.SourceElementController(db)]
	    ]);
	    return new ServerApiService_1.ServerApiService(db, routes, new QueryEngine_1.QueryEngine(db), fakeCreator);
	};


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Abstract interface for sources
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const Exceptions_1 = __webpack_require__(81);
	const moment = __webpack_require__(42);
	var ApiService_1 = __webpack_require__(6);
	exports.AppUrls = ApiService_1.AppUrls;
	const GeneralStatisticsController_1 = __webpack_require__(84);
	class ServerApiService {
	    constructor(db, routesMap, queryEngine, fakeCreator) {
	        this.controllerMap = routesMap;
	        this.queryEngine = queryEngine;
	        this.fakeCreator = fakeCreator;
	        this.db = db;
	    }
	    getItem(obj, baseUrl, uid) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.getItemJson(obj, uid);
	    }
	    getCollection(obj, baseUrl, params) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.getCollectionJson(obj, params);
	    }
	    postItem(obj, baseUrl, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.postItem(obj, Object.assign(data, {
	            creationTimestamp: moment().toISOString(),
	            lastmodifiedTimestamp: moment().toISOString(),
	            creator: this.fakeCreator ? 0 : data.creator
	        }));
	    }
	    putItem(obj, baseUrl, uid, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.putItem(obj, uid, Object.assign(data, {
	            lastmodifiedTimestamp: moment().toISOString()
	        }));
	    }
	    patchItem(obj, baseUrl, uid, data) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.patchItem(obj, uid, Object.assign(data, {
	            lastmodifiedTimestamp: moment().toISOString()
	        }));
	    }
	    delItem(obj, baseUrl, uid) {
	        const controller = this.controllerMap.get(baseUrl);
	        if (controller === undefined) {
	            return Promise.reject(new Exceptions_1.CollectionNotFoundException('Controller not found'));
	        }
	        return controller.deleteItem(obj, uid);
	    }
	    query(graphQLQuery) {
	        return Promise.resolve({});
	    }
	    getStats() {
	        return GeneralStatisticsController_1.GeneralStatisticsController(this.db.query());
	    }
	}
	exports.ServerApiService = ServerApiService;


/***/ },
/* 84 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Map of URIs to controllers
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	exports.GeneralStatisticsController = (db) => {
	    return Promise.all([
	        db('entities').count(),
	        db('entity_types').count(),
	        db('sources').count(),
	        db('records').count(),
	        db('predicates').count()
	    ]).then(([[entityCount], [entityTypeCount], [sourceCount], [recordCount], [predicateCount]]) => {
	        const statistics = {
	            entity: entityCount['count(*)'],
	            entityType: entityTypeCount['count(*)'],
	            source: sourceCount['count(*)'],
	            record: recordCount['count(*)'],
	            predicate: predicateCount['count(*)']
	        };
	        return statistics;
	    });
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(86);
	const entityQLType_1 = __webpack_require__(87);
	const predicateQLType_1 = __webpack_require__(88);
	class QueryEngine {
	    constructor(db) {
	        const entityType = entityQLType_1.entityQLType(db, predicateQLType_1.predicateQLType(db));
	        // Define the Query type
	        const queryType = new graphql_1.GraphQLObjectType({
	            name: 'Query',
	            fields: {
	                entity: {
	                    type: new graphql_1.GraphQLList(entityType),
	                    // `args` describes the arguments that the `user` query accepts
	                    args: {
	                        uid: { type: graphql_1.GraphQLString }
	                    },
	                    resolve: (_, { uid }) => {
	                        if (uid === undefined) {
	                            return db.query()('entities');
	                        }
	                        return db.query()('entities').where({ uid });
	                    }
	                }
	            }
	        });
	        this.schema = new graphql_1.GraphQLSchema({
	            query: queryType
	        });
	    }
	    runQuery(query) {
	        return graphql_1.graphql(this.schema, query);
	    }
	}
	exports.QueryEngine = QueryEngine;


/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(86);
	exports.entityQLType = (db, predicateType) => {
	    return new graphql_1.GraphQLObjectType({
	        name: 'Entity',
	        fields: {
	            uid: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return parent.uid;
	                }
	            },
	            label: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return parent.label;
	                }
	            },
	            type: {
	                type: graphql_1.GraphQLString,
	                resolve: (parent, {}) => {
	                    return db.query()('entity_types').where({ uid: parent.type }).first().then((data) => data.label);
	                }
	            },
	            predicate: {
	                type: predicateType,
	                args: {
	                    name: { type: graphql_1.GraphQLString },
	                    uid: { type: graphql_1.GraphQLString }
	                },
	                resolve: (entity, { name, uid }) => {
	                    if (name !== undefined) {
	                        return db.query()('predicates').where({ name }).first().then((predicate) => ({ predicate, entity }));
	                    }
	                    if (uid !== undefined) {
	                        return db.query()('predicates').where({ uid }).first().then((predicate) => ({ predicate, entity }));
	                    }
	                }
	            },
	            predicates: {
	                type: new graphql_1.GraphQLList(predicateType),
	                args: {
	                    names: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
	                    uids: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
	                },
	                resolve: (entity, { names, uids }) => {
	                    if (names !== undefined) {
	                        return db.query()('predicates')
	                            .whereIn('name', names)
	                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
	                    }
	                    if (uids !== undefined) {
	                        return db.query()('predicates')
	                            .whereIn('uid', uids)
	                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
	                    }
	                }
	            }
	        }
	    });
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Query processor
	 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const graphql_1 = __webpack_require__(86);
	exports.predicateQLType = (db) => {
	    return new graphql_1.GraphQLObjectType({
	        name: 'Predicate',
	        fields: {
	            uid: {
	                type: graphql_1.GraphQLString,
	                resolve: ({ predicate }, {}) => {
	                    return predicate.uid;
	                }
	            },
	            name: {
	                type: graphql_1.GraphQLString,
	                resolve: ({ predicate }, {}) => {
	                    return predicate.label;
	                }
	            },
	            values: {
	                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
	                resolve: ({ entity, predicate }, {}) => {
	                    return db.query()('records')
	                        .select('value_string')
	                        .where({ entity: entity.uid, predicate: predicate.uid })
	                        .then((results) => results.map((result) => result.value_string));
	                }
	            }
	        }
	    });
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Collated list of controllers
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var ElementSetController_1 = __webpack_require__(90);
	exports.ElementSetController = ElementSetController_1.ElementSetController;
	var EntityController_1 = __webpack_require__(92);
	exports.EntityController = EntityController_1.EntityController;
	var EntityTypeController_1 = __webpack_require__(93);
	exports.EntityTypeController = EntityTypeController_1.EntityTypeController;
	var PredicateController_1 = __webpack_require__(94);
	exports.PredicateController = PredicateController_1.PredicateController;
	var RecordController_1 = __webpack_require__(95);
	exports.RecordController = RecordController_1.RecordController;
	var SourceController_1 = __webpack_require__(96);
	exports.SourceController = SourceController_1.SourceController;
	var ElementController_1 = __webpack_require__(97);
	exports.ElementController = ElementController_1.ElementController;
	var SourceElementController_1 = __webpack_require__(98);
	exports.SourceElementController = SourceElementController_1.SourceElementController;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for element sets
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const lodash_1 = __webpack_require__(21);
	class ElementSetController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'element_sets');
	    }
	    static toSchema(data) {
	        return lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'elements');
	    }
	    static fromSchema(data) {
	        return __assign({}, Object.create(falcon_core_1.ElementSet.prototype), data);
	        // return Object.assign(Object.create(ElementSet.prototype), data);
	    }
	    toSchema(data) {
	        return ElementSetController.toSchema(data);
	    }
	    fromSchema(data) {
	        return ElementSetController.fromSchema(data);
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((elementSet) => {
	            if (elementSet.uid === null) {
	                throw new Error('could not find source');
	            }
	            return this.db.select('elements')
	                .where({ 'element_set': elementSet.uid })
	                .then((elements) => {
	                elementSet.elements = elements;
	                return elementSet;
	            });
	        });
	    }
	}
	exports.ElementSetController = ElementSetController;


/***/ },
/* 91 */
/***/ function(module, exports) {

	/**
	 * @fileOverview Generic controller containing logic common to most controller classes
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	class GenericController {
	    constructor(db, table, readTable) {
	        this.db = db;
	        this.tableName = table;
	        this.readTableName = readTable === undefined ? table : readTable;
	    }
	    getItemJson(obj, uid) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.loadItem(this.readTableName, uid)
	            .then((data) => this.fromSchema(data));
	    }
	    getCollectionJson(obj, params = {}) {
	        return this.db.loadCollection(this.readTableName, params)
	            .then((data) => data.map((datum) => this.fromSchema(datum)));
	    }
	    postItem(obj, data) {
	        return this.db.createItem(this.tableName, this.toSchema(data));
	    }
	    putItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.updateItem(this.tableName, this.toSchema(data));
	    }
	    patchItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.loadItem(this.tableName, uid)
	            .then((originalData) => {
	            return this.db.updateItem(this.tableName, this.toSchema(Object.assign(this.fromSchema(originalData), data)));
	        });
	    }
	    deleteItem(obj, uid) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.deleteItem(this.tableName, uid);
	    }
	}
	exports.GenericController = GenericController;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for entities
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const Exceptions_1 = __webpack_require__(81);
	const lodash_1 = __webpack_require__(21);
	class EntityController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'entities');
	    }
	    static fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Entity.prototype), {
	            entityType: data.type,
	            uid: data.uid,
	            label: data.label,
	            parent: data.parent
	        });
	    }
	    static toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'entityType', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            type: data.entityType,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return EntityController.fromSchema(data);
	    }
	    toSchema(data) {
	        return EntityController.toSchema(data);
	    }
	    getCollectionJson(obj, params = {}) {
	        const _super = name => super[name];
	        return __awaiter(this, void 0, void 0, function* () {
	            if (params.type !== undefined) {
	                const ancestorTypes = yield this.db.getChildrenOf(lodash_1.isArray(params.type) ? params.type[0] : params.type, 'entity_types');
	                return this.db.select('entities')
	                    .whereIn('type', ancestorTypes)
	                    .then((rawEntities) => rawEntities.map((entity) => this.fromSchema(entity)));
	            }
	            else {
	                return _super("getCollectionJson").call(this, obj, params);
	            }
	        });
	    }
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const [entities, records] = yield Promise.all([
	                this.db.select(this.tableName).where('parent', '=', uid),
	                this.db.select('records').where('value_entity', '=', uid)
	            ]);
	            if (entities.length + records.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the entity is referenced in other sources',
	                    data: Promise.resolve({
	                        entity: entities,
	                        record: records
	                    })
	                });
	            }
	        });
	    }
	}
	exports.EntityController = EntityController;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for entity types
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const PredicateController_1 = __webpack_require__(94);
	const EntityController_1 = __webpack_require__(92);
	const Exceptions_1 = __webpack_require__(81);
	const lodash_1 = __webpack_require__(21);
	class EntityTypeController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'entity_types');
	    }
	    toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.EntityType.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((result) => {
	            return Promise.all([
	                this.db.getAncestorsOf(uid, 'entity_types')
	                    .then((ancestors) => {
	                    return this.db.select('entity_types').whereIn('uid', ancestors)
	                        .then((results) => results.map((result) => this.fromSchema(result)));
	                }),
	                this.db.select('entity_types', ['uid']).where({ parent: uid })
	            ])
	                .then(([parents, children]) => {
	                result.parents = parents;
	                result.children = children.map((child) => child.uid);
	                return result;
	            });
	        });
	    }
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const [entityTypes, entities, predicates] = yield Promise.all([
	                this.db.select(this.tableName).where('parent', '=', uid),
	                this.db.select('entities').where('type', '=', uid),
	                this.db.select('predicates').where('domain', '=', uid).orWhere('range_ref', '=', uid)
	            ]);
	            if (entities.length + entityTypes.length + predicates.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the entity is referenced in other sources',
	                    data: Promise.resolve({
	                        entityType: entityTypes.map((entityType) => EntityController_1.EntityController.fromSchema(entityType)),
	                        entity: entities.map((entity) => EntityController_1.EntityController.fromSchema(entity)),
	                        predicate: predicates.map((predicate) => PredicateController_1.PredicateController.fromSchema(predicate))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.EntityTypeController = EntityTypeController;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for predicates
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const Exceptions_1 = __webpack_require__(81);
	const RecordController_1 = __webpack_require__(95);
	const lodash_1 = __webpack_require__(21);
	class PredicateController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'predicates', 'predicate_complete');
	    }
	    static toSchema(data) {
	        const out = Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'range', 'rangeIsReference', 'sameAs', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            range_type: data.rangeIsReference ? 'entity' : data.range,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	        if (data.rangeIsReference) {
	            out['range_ref'] = data.range;
	        }
	        else {
	            out['range_ref'] = null;
	        }
	        return out;
	    }
	    static fromSchema(data) {
	        if (data.range_type === 'entity') {
	            data.range = data.range_ref;
	            data.rangeIsReference = true;
	        }
	        else {
	            data.range = data.range_type;
	            data.rangeIsReference = false;
	        }
	        if (data.uses === null) {
	            data.uses = 0;
	        }
	        return Object.assign(Object.create(falcon_core_1.Predicate.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    toSchema(data) {
	        return PredicateController.toSchema(data);
	    }
	    fromSchema(data) {
	        return PredicateController.fromSchema(data);
	    }
	    getCollectionJson(obj, params = {}) {
	        const _super = name => super[name];
	        return __awaiter(this, void 0, void 0, function* () {
	            if (params.domain !== undefined) {
	                //TODO: this check should be unecessery
	                const ancestorIds = yield this.db.getAncestorsOf(lodash_1.isArray(params.domain) ? params.domain[0] : params.domain, 'entity_types');
	                return this.db.select(this.readTableName).whereIn('domain', ancestorIds.concat([params.domain[0]]))
	                    .then((results) => results.map((result) => this.fromSchema(result)));
	            }
	            else {
	                return _super("getCollectionJson").call(this, obj, params);
	            }
	        });
	    }
	    putItem(obj, uid, data) {
	        if (typeof (uid) !== 'number') {
	            throw new Error('Expected single column identifier');
	        }
	        return this.db.updateItem(this.tableName, falcon_core_1.Serializer.toJson(data));
	    }
	    patchItem(obj, uid, data) {
	        if (data.domain !== undefined) {
	            return this.db.select('records', ['entities.type as entityType'])
	                .distinct()
	                .where({ predicate: uid })
	                .innerJoin('entities', 'records.entity', 'entities.uid')
	                .then((records) => {
	                if (records.length > 0) {
	                    return this.db.getChildrenOf(data.domain, 'entity_types')
	                        .then((res) => {
	                        records.map((e) => e.entityType)
	                            .forEach((e) => {
	                            if (res.indexOf(e) === -1) {
	                                throw new Exceptions_1.OperationNotPermittedException({
	                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
	                                    data: Promise.resolve({})
	                                });
	                            }
	                        });
	                    }).then(() => super.patchItem(obj, uid, data));
	                }
	                return super.patchItem(obj, uid, data);
	            });
	        }
	        //TODO: fix range enforcement
	        if (data.range !== undefined) {
	            return this.db.select('records')
	                .where({ predicate: uid })
	                .then((records) => {
	                if (records.length > 0) {
	                    if (data.rangeIsReference === false) {
	                        throw new Exceptions_1.OperationNotPermittedException({
	                            message: 'The operation could not be completed as it would invalidate predicate relationships',
	                            data: Promise.resolve({})
	                        });
	                    }
	                    return this.db.getChildrenOf(parseInt(data.range), 'entity_types')
	                        .then((res) => {
	                        records.map((e) => e.value_entity)
	                            .forEach((e) => {
	                            if (res.indexOf(e) === -1) {
	                                throw new Exceptions_1.OperationNotPermittedException({
	                                    message: 'The operation could not be completed as it would invalidate predicate relationships',
	                                    data: Promise.resolve({})
	                                });
	                            }
	                        });
	                    }).then(() => super.patchItem(obj, uid, data));
	                }
	                return super.patchItem(obj, uid, data);
	            });
	        }
	        return super.patchItem(obj, uid, data);
	    }
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const records = yield this.db.loadCollection('records', { predicate: uid });
	            if (records.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the predicate is used by other records',
	                    data: Promise.resolve({
	                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.PredicateController = PredicateController;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for records
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const Exceptions_1 = __webpack_require__(81);
	const lodash_1 = __webpack_require__(21);
	class RecordController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'records');
	    }
	    static toSchema(data) {
	        const schemaOutput = lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'value', 'valueType', 'creationTimestamp', 'label', 'lastmodifiedTimestamp');
	        schemaOutput.value_type = data.valueType;
	        if (data.valueType !== undefined && data.valueType !== 'source') {
	            schemaOutput['value_' + data.valueType] = data.value;
	        }
	        return Object.assign({}, schemaOutput, {
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    static fromSchema(data) {
	        data.valueType = data.value_type;
	        switch (data.value_type) {
	            case 'entity':
	                data.value = data.value_entity;
	                break;
	            case 'string':
	                data.value = data.value_string;
	                break;
	            case 'date':
	                data.value = data.value_date;
	                break;
	            case 'integer':
	                data.value = data.value_integer;
	                break;
	            case 'point':
	                data.value = data.value_point;
	                break;
	            case 'region':
	                data.value = data.value_region;
	                break;
	            case 'source':
	                data.value = data.source;
	                break;
	            default:
	                data.value = null;
	        }
	        return Object.assign(Object.create(falcon_core_1.Record.prototype), data);
	    }
	    toSchema(data) {
	        return RecordController.toSchema(data);
	    }
	    fromSchema(data) {
	        return RecordController.fromSchema(data);
	    }
	    postItem(obj, data) {
	        // predicate domain must equal value_type
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.postItem(obj, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	    putItem(obj, uid, data) {
	        //TODO: what happens if we only update the value - and do not send the valueType again?
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.putItem(obj, uid, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	    patchItem(obj, uid, data) {
	        return this.db.select('predicates', ['range_type']).where({ uid: data.predicate })
	            .then(([predicate]) => {
	            if (data.valueType === predicate.range_type) {
	                //TODO: still need to check entity type constraints
	                return super.patchItem(obj, uid, data);
	            }
	            throw new Exceptions_1.OperationNotPermittedException({
	                message: 'Attempted to add a record with an incorrect type!',
	                data: Promise.resolve({})
	            });
	        });
	    }
	}
	exports.RecordController = RecordController;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for sources
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const Exceptions_1 = __webpack_require__(81);
	const RecordController_1 = __webpack_require__(95);
	const lodash_1 = __webpack_require__(21);
	class SourceController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'sources');
	    }
	    toSchema(data) {
	        return Object.assign({}, lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'metaData', 'sameAs', 'parents', 'children', 'creationTimestamp', 'lastmodifiedTimestamp'), {
	            same_as: data.sameAs,
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Source.prototype), Object.assign(data, {
	            'sameAs': data.same_as
	        }));
	    }
	    // override the getItemJson and getCollectionJson functions to also get information about the
	    // metadata associated with the retrieved source
	    getMetadata(fields, sourceId) {
	        return this.db.query().raw(`
	            WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
	                ancestor(uid) AS (
	                SELECT parent FROM parent_of WHERE uid=?
	                UNION ALL
	                SELECT parent FROM parent_of JOIN ancestor USING(uid) )
	
	            SELECT *
	                FROM ancestor;
	        `, sourceId).then((parents) => {
	            parents = lodash_1.map(parents, 'uid');
	            parents.pop();
	            parents = [sourceId].concat(parents);
	            return Promise.all(parents.map((parent) => this.db.query().select(fields)
	                .from('source_elements')
	                .innerJoin('elements', function () { this.on('source_elements.element', '=', 'elements.uid'); })
	                .innerJoin('element_sets', function () { this.on('element_sets.uid', '=', 'elements.element_set'); })
	                .where({ 'source_elements.source': parent }))).then((results) => {
	                const a = lodash_1.groupBy(lodash_1.flatten(results), 'label');
	                return Object.keys(a).reduce((prev, cur) => {
	                    const meta = lodash_1.omit(a[cur][0], 'source', 'value');
	                    meta['values'] = a[cur]
	                        .map((val) => ({ source: val.source, value: val.value, uid: val.uid }))
	                        .sort((a, b) => parents.indexOf(a.source) - parents.indexOf(b.source));
	                    return Object.assign(prev, { [cur]: meta });
	                }, {});
	            });
	        });
	    }
	    getItemJson(obj, uid) {
	        return super.getItemJson(obj, uid)
	            .then((source) => {
	            if (source.uid === null) {
	                throw new Error('could not find source');
	            }
	            return Promise.all([
	                this.getMetadata([
	                    'source_elements.source as source',
	                    'elements.label',
	                    'source_elements.value',
	                    'elements.description',
	                    'element_sets.label as element_set',
	                    'elements.comment',
	                    'elements.uri',
	                    'elements.uid as element_uid'
	                ], source.uid),
	                this.db.query().select('uid').from('sources').where({ parent: uid }),
	                this.db.query().raw(`
	                    WITH RECURSIVE parent_of(uid, parent) AS  (SELECT uid, parent FROM sources),
	                    ancestor(uid) AS (
	                    SELECT parent FROM parent_of WHERE uid=?
	                    UNION ALL
	                    SELECT parent FROM parent_of JOIN ancestor USING(uid) )
	
	                    SELECT uid
	                    FROM ancestor;
	                `, uid)
	            ])
	                .then(([sourceElements, children, parents]) => {
	                source.metaData = sourceElements;
	                source.children = children.map((child) => child.uid).filter((child) => child !== null);
	                source.parents = parents.map((parent) => parent.uid).filter((parent) => parent !== null);
	                return source;
	            });
	        });
	    }
	    getCollectionJson(obj, params = {}) {
	        return super.getCollectionJson(obj, params)
	            .then((sources) => {
	            return Promise.all(sources.map((source) => {
	                if (source.uid === null) {
	                    throw new Error('could not find source');
	                }
	                return this.getMetadata([
	                    'elements.label',
	                    'source_elements.value'
	                ], source.uid)
	                    .then((sourceElements) => {
	                    source.metaData = sourceElements;
	                    return source;
	                });
	            }));
	        });
	    }
	    //TODO should find every child source, not just the direct children
	    deleteItem(obj, uid) {
	        return __awaiter(this, void 0, void 0, function* () {
	            // check if this entity is the parent of another entity or if it has any relationships
	            // pointing towards it.
	            const [records, sources] = yield Promise.all([
	                this.db.loadCollection('records', { source: uid }),
	                this.db.loadCollection('sources', { parent: uid })
	            ]);
	            if (records.length + sources.length === 0) {
	                return this.db.deleteItem(this.tableName, uid);
	            }
	            else {
	                throw new Exceptions_1.OperationNotPermittedException({
	                    message: 'The operation could not be completed as the source is used by other records',
	                    data: Promise.resolve({
	                        record: records.map((record) => RecordController_1.RecordController.fromSchema(record)),
	                        source: sources.map((source) => this.fromSchema(source))
	                    })
	                });
	            }
	        });
	    }
	}
	exports.SourceController = SourceController;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for elements
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	class ElementController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'elements');
	    }
	    toSchema(data) {
	        return falcon_core_1.Serializer.toJson(data);
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.Element.prototype), data);
	    }
	}
	exports.ElementController = ElementController;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview Controller for source elements
	 * @author <a href='mailto:tim.hollies@warwick.ac.uk'>Tim Hollies</a>
	 * @version 0.0.1
	 */
	"use strict";
	const falcon_core_1 = __webpack_require__(8);
	const GenericController_1 = __webpack_require__(91);
	const Exceptions_1 = __webpack_require__(81);
	const lodash_1 = __webpack_require__(21);
	class SourceElementController extends GenericController_1.GenericController {
	    constructor(db) {
	        super(db, 'source_elements');
	    }
	    toSchema(data) {
	        return Object.assign(lodash_1.omit(falcon_core_1.Serializer.toJson(data), 'creationTimestamp', 'lastmodifiedTimestamp', 'uid', 'label'), {
	            creation_timestamp: data.creationTimestamp,
	            lastmodified_timeStamp: data.lastmodifiedTimestamp,
	            // TODO: check these exist
	            source: data.uid.values['source'],
	            element: data.uid.values['element']
	        });
	    }
	    fromSchema(data) {
	        return Object.assign(Object.create(falcon_core_1.SourceElement.prototype), Object.assign(data, {
	            uid: {
	                order: ['source', 'element'],
	                values: {
	                    source: data.source,
	                    element: data.element
	                }
	            }
	        }));
	    }
	    getItemJson(obj, uid) {
	        return this.db.query().select()
	            .from(this.tableName)
	            .where(uid.values)
	            .first()
	            .then((result) => result === undefined ? Promise.reject(new Exceptions_1.KeyNotFoundException()) : result)
	            .then((data) => this.fromSchema(data));
	    }
	    putItem(obj, uid, data) {
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .update(this.toSchema(data));
	    }
	    patchItem(obj, uid, data) {
	        const schemaData = this.toSchema(data);
	        const keys = Object.keys(schemaData);
	        const updateObject = {};
	        for (let i = 0; i < keys.length; i += 1) {
	            if (schemaData[keys[i]] !== undefined) {
	                updateObject[keys[i]] = schemaData[keys[i]];
	            }
	        }
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .update(updateObject)
	            .then(() => true)
	            .catch((err) => { throw new Error(err); });
	    }
	    deleteItem(obj, uid) {
	        return this.db.query()(this.tableName)
	            .where(uid.values)
	            .del();
	    }
	}
	exports.SourceElementController = SourceElementController;


/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ }
/******/ ]);
//# sourceMappingURL=app.electron.dist.js.map