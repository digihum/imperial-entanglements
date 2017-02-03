/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const ApiService_1 = require("../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
const RecordRow_1 = require("./RecordRow");
const AddTabButton_1 = require("../AddTabButton");
const RecordEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(RecordRow_1.RecordRow);
class RecordPredicate extends React.Component {
    constructor() {
        super();
        this.state = {
            potentialValues: []
        };
    }
    componentDidMount() {
        if (this.props.predicate.rangeIsReference) {
            this.props.dataStore.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, { type: this.props.predicate.range })
                .then((potentialValues) => this.setState({ potentialValues }));
        }
    }
    createNewRecord() {
        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
            predicate: this.props.predicate.uid,
            entity: this.props.entity_id,
            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
            score: 3,
            source: this.props.dataStore.defaultSource
        }), {});
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
    recordChanged(record) {
        this.props.dataStore.putItem(falcon_core_1.Record, ApiService_1.AppUrls.record, this.props.entity_id, falcon_core_1.Serializer.toJson(record));
    }
    render() {
        if (this.props.predicate.uid === null) {
            throw new Error('Expected uid to be a number, it was null');
        }
        return (React.createElement("section", null,
            React.createElement("h5", { className: 'section-header' },
                this.props.predicate.label,
                " ",
                React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: `Add new ${this.props.predicate.label} record` }),
                React.createElement(AddTabButton_1.AddTabButton, { uid: this.props.predicate.uid, tabType: 'predicate' })),
            React.createElement("table", { className: 'record-editing-table' },
                React.createElement("thead", null,
                    React.createElement("tr", { className: 'record-row title' },
                        React.createElement("th", { className: 'record-row-item uid' }, "ID"),
                        this.props.predicate.range !== 'source' ? (React.createElement("th", { className: 'record-row-item' }, "Value")) : null,
                        React.createElement("th", { className: 'record-row-item' }, "Source"),
                        React.createElement("th", { className: 'record-row-item score' }, "Score"),
                        React.createElement("th", { className: 'record-row-item score' }, "Period"),
                        React.createElement("th", { className: 'record-row-item buttons' }, "Actions"))),
                React.createElement("tbody", null, this.props.records.map((record) => (React.createElement(RecordEditableFieldComponent, { key: `row-${record.uid}`, value: record, onChange: this.recordChanged.bind(this), onDelete: this.deleteRecord.bind(this), sources: this.props.sources, entities: this.state.potentialValues })))))));
    }
}
exports.RecordPredicate = RecordPredicate;
//# sourceMappingURL=RecordPredicate.js.map