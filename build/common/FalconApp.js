/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//https://react-router.now.sh/Match
const React = require("react");
const react_router_1 = require("react-router");
const RouteNotFound_1 = require("./views/RouteNotFound");
const ApiService_1 = require("./ApiService");
const itemTypes_1 = require("./itemTypes");
const Admin_1 = require("./views/Admin");
const AdminApp_1 = require("../app/AdminApp");
const User_1 = require("./views/User");
const UserManagement_1 = require("./views/UserManagement");
const AppDownload_1 = require("./views/AppDownload");
const DatabaseUpload_1 = require("./views/DatabaseUpload");
const react_router_2 = require("react-router");
const ObjectEditor_1 = require("./views/ObjectEditor");
class FalconApp extends React.Component {
    constructor(props) {
        super();
        this.state = {
            user: '',
            stats: null,
            tabsets: []
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.environment === 'website' && window !== undefined) {
                const userData = yield fetch('/currentuser', { credentials: 'same-origin' })
                    .then((response) => response.json());
                const tabsets = yield fetch('/tabset', { credentials: 'same-origin' })
                    .then((response) => response.json());
                this.setState({ user: userData.username, tabsets });
            }
            this.props.api.getStats()
                .then((stats) => {
                this.setState({ stats });
            });
        });
    }
    render() {
        return (React.createElement("div", { id: 'main', className: 'flex-fill' },
            React.createElement(this.props.router, __assign({}, this.props.routerSettings, { className: 'flex-fill', basename: 'http://localhost:8080' }),
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
                            React.createElement("a", { href: '/logout', className: 'header-link' }, "Logout"),
                            React.createElement("a", { href: '/', className: 'header-link' },
                                React.createElement("i", { className: 'fa fa-external-link' })))) : null),
                    this.props.environment === 'website' ? (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: (matchprops) => (React.createElement(Admin_1.Admin, __assign({}, matchprops, { stats: this.state.stats, tabsets: this.state.tabsets }))) })) : (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: (matchprops) => (React.createElement(AdminApp_1.AdminApp, __assign({}, matchprops, { stats: this.state.stats }))) })),
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
//# sourceMappingURL=FalconApp.js.map