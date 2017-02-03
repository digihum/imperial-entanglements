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
const AddTabButton_1 = require("../AddTabButton");
const mobx_react_1 = require("mobx-react");
const SearchBar_1 = require("../SearchBar");
const RecursiveTree_1 = require("../RecursiveTree");
class SourceRecursiveTree extends RecursiveTree_1.RecursiveTree {
}
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
                        if (source.uid === null) {
                            throw new Error('Encountered source with null uid');
                        }
                        return (React.createElement("tr", { key: `source-${source.uid}` },
                            React.createElement("td", null,
                                source.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: source.uid, tabType: 'source' })),
                            React.createElement("td", null, source.label),
                            React.createElement("td", null, source.parent)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(SourceRecursiveTree, { data: this.props.dataStore.dataStore.all.source.value, tabType: 'source', parentId: null, dataStore: this.props.dataStore }))))));
    }
};
SourceList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], SourceList);
exports.SourceList = SourceList;
//# sourceMappingURL=SourceList.js.map