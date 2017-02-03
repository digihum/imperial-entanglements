/**
 * @fileOverview <Description Missing>
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
const ApiService_1 = require("../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const SearchBar_1 = require("../SearchBar");
const RecordPredicate_1 = require("./RecordPredicate");
const findParentTree_1 = require("../../helper/findParentTree");
const mobx_react_1 = require("mobx-react");
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
        const entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
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
                options: predicates.map((pred) => ({ key: pred.label, value: pred })),
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
//# sourceMappingURL=RecordsEditor.js.map