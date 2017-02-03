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
const lev = require("levenshtein");
const ComboDropdown_1 = require("../ComboDropdown");
const lodash_1 = require("lodash");
const AddTabButton_1 = require("../AddTabButton");
const formatDate_1 = require("../../helper/formatDate");
const mobx_react_1 = require("mobx-react");
const sortIcons = {
    'none': 'fa fa-sort',
    'asc': 'fa fa-sort-asc',
    'desc': 'fa fa-sort-desc'
};
const customColumns = (predicates, columns, updateColumnParams, rotateSort) => {
    return [0, 1, 2].map((id) => {
        const comboValue = { key: '', value: null };
        if (columns[id].predicate !== -1) {
            const thisPred = predicates.find((pred) => pred.uid == columns[id].predicate);
            if (thisPred !== undefined) {
                comboValue.key = thisPred.label;
            }
            comboValue.value = columns[id].predicate;
        }
        return (React.createElement("td", { key: `col-${id}` },
            React.createElement("div", { className: 'list-combo-header' },
                React.createElement("div", { className: 'combo-wrapper' },
                    React.createElement(ComboDropdown_1.NumberComboDropdown, { value: comboValue, typeName: 'predicate', allowNew: false, setValue: (value) => updateColumnParams(id, 'p', value === null ? null : value.value), options: predicates.map((pred) => ({ key: pred.label, value: pred.uid.toString() })), createNewValue: lodash_1.noop, additionalClasses: ['compact'] })),
                React.createElement("div", { className: 'order-wrapper' },
                    React.createElement("i", { className: sortIcons[columns[id].sort], onClick: () => rotateSort(id) })))));
    });
};
let EntityList = class EntityList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            entities: [],
            entityTypes: [],
            predicates: [],
            columns: [
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' },
                { predicate: -1, sort: 'none', filterType: 'any', invertFilter: false, filterValue: '' }
            ],
            entityType: { key: 'Any', value: 0 },
            queryData: {}
        };
    }
    componentDidMount() {
        this.update(this.props);
    }
    componentWillReceiveProps(newProps) {
        this.update(newProps);
    }
    update(props) {
        const queryStringOptions = props.query;
        const columns = lodash_1.cloneDeep(this.state.columns);
        if (queryStringOptions !== null) {
            for (let i = 1; i < 4; i += 1) {
                columns[i - 1].predicate = queryStringOptions[`col${i}p`] || null;
                columns[i - 1].sort = queryStringOptions[`col${i}s`] || null;
                columns[i - 1].filterType = queryStringOptions[`col${i}f`] || '';
                columns[i - 1].filterValue = queryStringOptions[`col${i}v`] || '';
                columns[i - 1].invertFilter = queryStringOptions[`col${i}i`] || null;
            }
        }
        this.setState({
            columns,
            queryData: queryStringOptions === null ? {} : queryStringOptions
        });
    }
    addNew() {
        const a = {
            name: 'entity',
            complete: () => {
            },
            cancel: () => { console.log('cancel'); },
            settings: {
                initialName: ''
            }
        };
        this.props.modalStore.addModal(a);
    }
    updateColumnParams(colId, key, value) {
        this.context.router.transitionTo({
            pathname: '/edit/entity',
            query: Object.assign(this.state.queryData, { [`col${colId + 1}${key}`]: value })
        });
    }
    rotateSort(colId) {
        const columns = lodash_1.cloneDeep(this.state.columns);
        switch (columns[colId].sort) {
            case 'none':
                columns[colId].sort = 'asc';
                break;
            case 'asc':
                columns[colId].sort = 'desc';
                break;
            case 'desc':
                columns[colId].sort = 'none';
        }
        this.setState({
            columns
        });
    }
    addViewTab() {
        const tabData = {};
        const mapping = [
            { key: 'p', display: 'Predicate', mod: (data) => this.props.dataStore.dataStore.all.predicate.value.find((pred) => pred.uid == data).label },
            { key: 's', display: 'Sort', mod: (data) => data },
            { key: 'f', display: 'filterType', mod: (data) => data },
            { key: 'v', display: 'filterValue', mod: (data) => data },
            { key: 'i', display: 'invertFilter', mod: (data) => data }
        ];
        for (let i = 1; i < 4; i += 1) {
            for (let j = 0; j < mapping.length; j += 1) {
                if (this.state.queryData[`col${i}${mapping[j].key}`] !== undefined) {
                    if (tabData[`Column ${i}`] === undefined) {
                        tabData[`Column ${i}`] = {};
                    }
                    tabData[`Column ${i}`][mapping[j].display] = mapping[j].mod(this.state.queryData[`col${i}${mapping[j].key}`]);
                }
            }
        }
        this.props.dataStore.createTab('entity', Date.now(), 'view', tabData, this.props.query);
    }
    render() {
        const entities = this.props.dataStore.dataStore.all.entity.value;
        const predicates = this.props.dataStore.dataStore.all.predicate.value;
        const entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
        const entityTypeOptions = entityTypes.map((entityType) => ({ key: entityType.label, value: entityType.uid }));
        const tableData = entities.map((entity) => {
            const entityType = entityTypes.find((t) => t.uid === entity.entityType);
            const entityData = this.props.dataStore.dataStore.records.filter((res) => res.entity === entity.uid);
            return {
                uid: entity.uid,
                label: entity.label,
                entityType,
                columns: this.state.columns.map((col) => {
                    let value = '';
                    if (entityData !== undefined && col.predicate !== -1) {
                        const predicateData = entityData
                            .filter((record) => record.predicate == col.predicate);
                        if (predicateData !== undefined) {
                            value = predicateData.map((pred) => {
                                if (pred.valueType === 'date') {
                                    return formatDate_1.formatDate(pred.value);
                                }
                                if (pred.valueType === 'source') {
                                    if (pred.value === null) {
                                        return 'Not set';
                                    }
                                    return this.props.dataStore.dataStore.all.source.value.find((source) => source.uid === pred.value).label;
                                }
                                if (pred.valueType === 'entity') {
                                    if (pred.value === null) {
                                        return 'Not set';
                                    }
                                    return this.props.dataStore.dataStore.all.entity.value.find((entity) => entity.uid === pred.value).label;
                                }
                                return pred.value;
                            }).join(', ');
                        }
                        return value;
                    }
                })
            };
        })
            .filter((row) => {
            let keepRow = true;
            this.state.columns.forEach((col, i) => {
                if (col.filterType === 'contains' && col.filterValue.length > 0 && col.predicate !== null) {
                    if (row.columns[i].toLowerCase().indexOf(col.filterValue.toLowerCase()) === -1) {
                        keepRow = false;
                    }
                }
                if (col.filterType === 'exists' && col.predicate !== null) {
                    if (row.columns[i].length === 0) {
                        keepRow = false;
                    }
                }
                if (col.filterType === 'similar' && col.predicate !== null && col.filterValue.length > 0) {
                    if (new lev(row.columns[i], col.filterValue).distance >= col.filterValue.length + 2) {
                        keepRow = false;
                    }
                }
            });
            return keepRow;
        })
            .sort((row1, row2) => {
            let score = 0;
            this.state.columns.forEach((col, i) => {
                if (col.sort !== 'none' && row1.columns[i] !== row2.columns[i]) {
                    score += (row1.columns[i] > row2.columns[i] ? 1 : -1) * (Math.pow(10, 3 - i)) * (col.sort === 'asc' ? -1 : 1);
                }
            });
            return score;
        });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("h2", null,
                            "All Entities ",
                            React.createElement("i", { className: 'fa fa-plus-circle add button', title: 'Add new entity', "aria-hidden": 'true', onClick: this.addNew.bind(this) }))),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-folder-open-o', "aria-hidden": 'true', onClick: this.addViewTab.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity selected' }, "LIST")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("table", { className: 'table' },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "#"),
                            React.createElement("td", null, "Label"),
                            React.createElement("td", null, "Type"),
                            customColumns(predicates, this.state.columns, this.updateColumnParams.bind(this), this.rotateSort.bind(this))),
                        React.createElement("tr", null,
                            React.createElement("td", null),
                            React.createElement("td", null),
                            React.createElement("td", null,
                                React.createElement(ComboDropdown_1.NumberComboDropdown, { value: this.state.entityType, typeName: 'entity type', allowNew: false, setValue: (entityType) => this.setState({ entityType }), options: entityTypeOptions, createNewValue: lodash_1.noop, additionalClasses: ['compact'] })),
                            this.state.columns.map((col, id) => (React.createElement("td", { key: `col-${id}` },
                                React.createElement("div", { className: 'flex-fill' },
                                    React.createElement("div", null,
                                        React.createElement("select", { value: col.filterType, className: 'padded', onChange: (e) => this.updateColumnParams(id, 'f', e.target.value) },
                                            React.createElement("option", { value: 'any' }, "Any"),
                                            React.createElement("option", { value: 'exists' }, "Exists"),
                                            React.createElement("option", { value: 'contains' }, "Contains"),
                                            React.createElement("option", { value: 'similar' }, "Similar"))),
                                    React.createElement("div", null,
                                        React.createElement("input", { type: 'text', disabled: col.filterType === 'any' || col.filterType === 'exists', onChange: (e) => this.updateColumnParams(id, 'v', e.target.value), value: col.filterValue })))))))),
                    React.createElement("tbody", null, tableData.map((row) => (React.createElement("tr", { key: `entity-${row.uid}` },
                        React.createElement("td", null, row.uid),
                        React.createElement("td", null,
                            row.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { uid: row.uid, tabType: 'entity' })),
                        React.createElement("td", null, row.entityType ? row.entityType.label : ''),
                        [0, 1, 2].map((id) => (React.createElement("td", { key: `col-val-${id}` }, row.columns[id])))))))))));
    }
};
EntityList.contextTypes = {
    router: React.PropTypes.object.isRequired
};
EntityList = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], EntityList);
exports.EntityList = EntityList;
//# sourceMappingURL=EntityList.js.map