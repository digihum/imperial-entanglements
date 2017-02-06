/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
var React = require("react");
var AddTabButton_1 = require("../AddTabButton");
var SearchBar_1 = require("../SearchBar");
var RecursiveTree_1 = require("../RecursiveTree");
var mobx_react_1 = require("mobx-react");
var EntityRecursiveTree = (function (_super) {
    __extends(EntityRecursiveTree, _super);
    function EntityRecursiveTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EntityRecursiveTree;
}(RecursiveTree_1.RecursiveTree));
var EntityTypeList = (function (_super) {
    __extends(EntityTypeList, _super);
    function EntityTypeList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; },
            mode: 'list'
        };
        return _this;
    }
    EntityTypeList.prototype.addNew = function () {
        var a = {
            name: 'entity_type',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {}
        };
        this.props.modalStore.addModal(a);
    };
    EntityTypeList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity_type' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Entity Types ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new entity type', onClick: this.addNew.bind(this) })))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'list' }); } }, "LIST"),
                        React.createElement("div", { className: 'entity_type ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'tree' }); } }, "TREE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Name"),
                            React.createElement("td", null, "Parent"),
                            React.createElement("td", null, "Description"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.entity_type.value.filter(this.state.filterFunc).map(function (entityType) {
                        if (entityType.uid === null) {
                            throw new Error('Found entity with no id');
                        }
                        return (React.createElement("tr", { key: "entityType-" + entityType.uid },
                            React.createElement("td", null,
                                entityType.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' })),
                            React.createElement("td", null, entityType.label),
                            React.createElement("td", null, entityType.parent),
                            React.createElement("td", null, entityType.description)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(EntityRecursiveTree, { data: this.props.dataStore.dataStore.all.entity_type.value, tabType: 'entity_type', parentId: null, dataStore: this.props.dataStore }))))));
    };
    return EntityTypeList;
}(React.Component));
EntityTypeList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], EntityTypeList);
exports.EntityTypeList = EntityTypeList;
//# sourceMappingURL=EntityTypeList.js.map