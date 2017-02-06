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
var ApiService_1 = require("../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var SearchBar_1 = require("../SearchBar");
var RecordPredicate_1 = require("./RecordPredicate");
var findParentTree_1 = require("../../helper/findParentTree");
var mobx_react_1 = require("mobx-react");
var RecordsEditor = (function (_super) {
    __extends(RecordsEditor, _super);
    function RecordsEditor() {
        var _this = _super.call(this) || this;
        _this.state = {
            filterFunc: function () { return true; }
        };
        return _this;
    }
    RecordsEditor.prototype.deleteRecord = function (record) {
        var _this = this;
        if (record.uid === null) {
            throw new Error('Trying to delete a record with null id');
        }
        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
            .then(function () {
            _this.props.onChange();
        });
    };
    RecordsEditor.prototype.createNewRecord = function () {
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        var modalDef = {
            name: 'record',
            complete: function (data) {
                console.log('Records editor called complete');
                //this.loadData(this.props);
            },
            cancel: function () {
                console.log('Records editor called cancel');
            },
            settings: {
                options: predicates.map(function (pred) { return ({ key: pred.label, value: pred }); }),
                entityUid: this.props.id,
                entityType: this.props.entityTypeId
            }
        };
        this.props.modalStore.addModal(modalDef);
    };
    RecordsEditor.prototype.render = function () {
        var _this = this;
        var predicates = this.props.predicates;
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("div", null,
                    React.createElement("label", { className: 'small' }, "Records"),
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { style: { flex: '1' } },
                            React.createElement(SearchBar_1.SearchBar, { getValue: function (p) { return p.label; }, setFilterFunc: function (filterFunc) { return _this.setState({ filterFunc: filterFunc }); } })),
                        React.createElement("div", { style: { padding: '0.1em 0.4em', fontSize: '2em' } },
                            React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: 'Add new record' }))),
                    React.createElement("div", null, Object.keys(this.props.records).map(function (section) {
                        var currentPredicate = predicates.find(function (pred) {
                            if (pred.uid === null) {
                                throw new Error('encountered predicate with null id');
                            }
                            return pred.uid.toString() === section;
                        });
                        if (currentPredicate === undefined) {
                            throw new Error('Could not find predicate');
                        }
                        if (!_this.state.filterFunc(currentPredicate)) {
                            return null;
                        }
                        return (React.createElement(RecordPredicate_1.RecordPredicate, { key: "section-" + section, entity_id: _this.props.id, dataStore: _this.props.dataStore, dimension: 'predicate', records: _this.props.records[section], predicate: currentPredicate, sources: _this.props.sources, onChange: _this.props.onChange }));
                    }))))));
    };
    return RecordsEditor;
}(React.Component));
RecordsEditor = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], RecordsEditor);
exports.RecordsEditor = RecordsEditor;
//# sourceMappingURL=RecordsEditor.js.map