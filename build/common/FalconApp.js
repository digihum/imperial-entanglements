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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//https://react-router.now.sh/Match
var React = require("react");
var react_router_1 = require("react-router");
var RouteNotFound_1 = require("./views/RouteNotFound");
var ApiService_1 = require("./ApiService");
var itemTypes_1 = require("./itemTypes");
var Admin_1 = require("./views/Admin");
var AdminApp_1 = require("../app/AdminApp");
var User_1 = require("./views/User");
var UserManagement_1 = require("./views/UserManagement");
var AppDownload_1 = require("./views/AppDownload");
var DatabaseUpload_1 = require("./views/DatabaseUpload");
var react_router_2 = require("react-router");
var ObjectEditor_1 = require("./views/ObjectEditor");
var FalconApp = (function (_super) {
    __extends(FalconApp, _super);
    function FalconApp(props) {
        var _this = _super.call(this) || this;
        _this.state = {
            user: '',
            stats: null,
            tabsets: []
        };
        return _this;
    }
    FalconApp.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var userData, tabsets;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.props.environment === 'website' && window !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch('/currentuser', { credentials: 'same-origin' })
                                .then(function (response) { return response.json(); })];
                    case 1:
                        userData = _a.sent();
                        return [4 /*yield*/, fetch('/tabset', { credentials: 'same-origin' })
                                .then(function (response) { return response.json(); })];
                    case 2:
                        tabsets = _a.sent();
                        this.setState({ user: userData.username, tabsets: tabsets });
                        _a.label = 3;
                    case 3:
                        this.props.api.getStats()
                            .then(function (stats) {
                            _this.setState({ stats: stats });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FalconApp.prototype.render = function () {
        var _this = this;
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
                    this.props.environment === 'website' ? (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: function (matchprops) { return (React.createElement(Admin_1.Admin, __assign({}, matchprops, { stats: _this.state.stats, tabsets: _this.state.tabsets }))); } })) : (React.createElement(react_router_1.Match, { exactly: true, pattern: '/', render: function (matchprops) { return (React.createElement(AdminApp_1.AdminApp, __assign({}, matchprops, { stats: _this.state.stats }))); } })),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/user', component: User_1.User }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/users', component: UserManagement_1.UserManagement }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/app', component: AppDownload_1.AppDownload }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/upload', component: DatabaseUpload_1.DatabaseUpload }),
                    React.createElement(react_router_1.Match, { exactly: true, pattern: '/search', render: function (matchprops) { return (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: _this.props.api }, matchprops, { workspace: 'search' }))); } }),
                    React.createElement(react_router_1.Match, { pattern: '/edit/:workspace', render: function (matchprops) { return (React.createElement(ObjectEditor_1.ObjectEditor, __assign({ api: _this.props.api }, matchprops, { workspace: matchprops.params.workspace === 'property' ? 'predicate' : matchprops.params.workspace }))); } }),
                    React.createElement(react_router_1.Miss, { component: RouteNotFound_1.RouteNotFound })))));
    };
    return FalconApp;
}(React.Component));
exports.FalconApp = FalconApp;
//# sourceMappingURL=FalconApp.js.map