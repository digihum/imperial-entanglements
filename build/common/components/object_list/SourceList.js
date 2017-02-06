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
var mobx_react_1 = require("mobx-react");
var SearchBar_1 = require("../SearchBar");
var RecursiveTree_1 = require("../RecursiveTree");
var SourceRecursiveTree = (function (_super) {
    __extends(SourceRecursiveTree, _super);
    function SourceRecursiveTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SourceRecursiveTree;
}(RecursiveTree_1.RecursiveTree));
var SourceList = (function (_super) {
    __extends(SourceList, _super);
    function SourceList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; },
            mode: 'list'
        };
        return _this;
    }
    SourceList.prototype.addNew = function () {
        var a = {
            name: 'source',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {}
        };
        this.props.modalStore.addModal(a);
    };
    SourceList.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header source' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Sources ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', title: 'Add new source', onClick: this.addNew.bind(this) })))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'source ' + (this.state.mode === 'list' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'list' }); } }, "LIST"),
                        React.createElement("div", { className: 'source ' + (this.state.mode === 'tree' ? 'selected' : ''), onClick: function () { return _this.setState({ mode: 'tree' }); } }, "TREE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                this.state.mode === 'list' ? (React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Name"),
                            React.createElement("td", null, "Parent"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.source.value.filter(this.state.filterFunc).map(function (source) {
                        if (source.uid === null) {
                            throw new Error('Encountered source with null uid');
                        }
                        return (React.createElement("tr", { key: "source-" + source.uid },
                            React.createElement("td", null,
                                source.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: source.uid, tabType: 'source' })),
                            React.createElement("td", null, source.label),
                            React.createElement("td", null, source.parent)));
                    })))) : (React.createElement("div", { className: 'tree-root' },
                    React.createElement(SourceRecursiveTree, { data: this.props.dataStore.dataStore.all.source.value, tabType: 'source', parentId: null, dataStore: this.props.dataStore }))))));
    };
    return SourceList;
}(React.Component));
SourceList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], SourceList);
exports.SourceList = SourceList;
//# sourceMappingURL=SourceList.js.map