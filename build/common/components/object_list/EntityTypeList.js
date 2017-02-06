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
const SearchBar_1 = require("../SearchBar");
const RecursiveTree_1 = require("../RecursiveTree");
const mobx_react_1 = require("mobx-react");
class EntityRecursiveTree extends RecursiveTree_1.RecursiveTree {
}
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
                        if (entityType.uid === null) {
                            throw new Error('Found entity with no id');
                        }
                        return (React.createElement("tr", { key: `entityType-${entityType.uid}` },
                            React.createElement("td", null,
                                entityType.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' })),
                            React.createElement("td", null, entityType.label),
                            React.createElement("td", null, entityType.parent),
                            React.createElement("td", null, entityType.description)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(EntityRecursiveTree, { data: this.props.dataStore.dataStore.all.entity_type.value, tabType: 'entity_type', parentId: null, dataStore: this.props.dataStore }))))));
    }
};
EntityTypeList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], EntityTypeList);
exports.EntityTypeList = EntityTypeList;
//# sourceMappingURL=EntityTypeList.js.map