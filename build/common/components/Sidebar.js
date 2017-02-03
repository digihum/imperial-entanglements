/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
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
const React = require("react");
const SearchBox_1 = require("./sidebar/SearchBox");
const ApiService_1 = require("../ApiService");
const react_router_1 = require("react-router");
const lodash_1 = require("lodash");
const react_sortable_hoc_1 = require("react-sortable-hoc");
const mobx_react_1 = require("mobx-react");
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
        React.createElement(Handle, { tabType: props.tab.tabType, index: props.index }),
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
            React.createElement(SearchBox_1.SearchBox, { searchString: this.state.searchString, dataStore: this.props.dataStore }),
            React.createElement("div", { className: 'sidebar-toolbar' },
                React.createElement("button", { onClick: () => this.props.dataStore.clearAllTabs() },
                    React.createElement("i", { className: 'fa fa-trash' }),
                    " Clear All"),
                React.createElement("button", { onClick: () => this.props.modalStore.addModal({ name: 'createTabSet', cancel: lodash_1.noop, complete: lodash_1.noop, settings: {} }) },
                    React.createElement("i", { className: 'fa fa-floppy-o' }),
                    " Save"),
                React.createElement("button", { onClick: () => this.setState({ compactMode: !this.state.compactMode }) },
                    React.createElement("i", { className: 'fa fa-compress' }),
                    " Compact")),
            React.createElement("div", { className: 'card-list-container' },
                React.createElement(CardList, { dataStore: this.props.dataStore, list: this.props.list, workspace: this.props.workspace, id: this.props.id, compact: this.state.compactMode }))));
    }
};
Sidebar = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], Sidebar);
exports.Sidebar = Sidebar;
//# sourceMappingURL=Sidebar.js.map