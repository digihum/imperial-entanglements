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
var PredicateList = (function (_super) {
    __extends(PredicateList, _super);
    function PredicateList() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; }
        };
        return _this;
    }
    PredicateList.prototype.addNew = function () {
        var a = {
            name: 'predicate',
            complete: function () {
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialName: ''
            }
        };
        this.props.modalStore.addModal(a);
    };
    PredicateList.prototype.render = function () {
        var _this = this;
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
                React.createElement(SearchBar_1.SearchBar, { getValue: function (a) { return a.label; }, setFilterFunc: function (f) { return _this.setState({ filterFunc: f }); } }),
                React.createElement("table", { className: 'table gap' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Label"),
                            React.createElement("td", null, "Domain"),
                            React.createElement("td", null, "Range"),
                            React.createElement("td", null, "Uses"))),
                    React.createElement("tbody", null, this.props.dataStore.dataStore.all.predicate.value.filter(this.state.filterFunc).map(function (predicate) {
                        var entityType = _this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === predicate.domain; });
                        var rangeType = predicate.rangeIsReference ?
                            _this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === predicate.range; }) :
                            predicate.range;
                        if (predicate.uid === null) {
                            throw new Error('Found predicate with null uid');
                        }
                        return (React.createElement("tr", { key: "predicate-" + predicate.uid },
                            React.createElement("td", null,
                                predicate.uid,
                                " ",
                                React.createElement(AddTabButton_1.AddTabButton, { uid: predicate.uid, tabType: 'predicate' })),
                            React.createElement("td", null, predicate.label),
                            React.createElement("td", null, entityType ? entityType.label : ''),
                            React.createElement("td", null, predicate.rangeIsReference ? rangeType ? rangeType.label : '' : rangeType),
                            React.createElement("td", null, predicate.uses)));
                    }))))));
    };
    return PredicateList;
}(React.Component));
PredicateList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], PredicateList);
exports.PredicateList = PredicateList;
//# sourceMappingURL=PredicateList.js.map