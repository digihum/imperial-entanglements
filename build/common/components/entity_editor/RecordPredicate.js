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
var React = require("react");
var ApiService_1 = require("../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
var RecordRow_1 = require("./RecordRow");
var AddTabButton_1 = require("../AddTabButton");
var RecordEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(RecordRow_1.RecordRow);
var RecordPredicate = (function (_super) {
    __extends(RecordPredicate, _super);
    function RecordPredicate() {
        var _this = _super.call(this) || this;
        _this.state = {
            potentialValues: []
        };
        return _this;
    }
    RecordPredicate.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.predicate.rangeIsReference) {
            this.props.dataStore.getCollection(falcon_core_1.Entity, ApiService_1.AppUrls.entity, { type: this.props.predicate.range })
                .then(function (potentialValues) { return _this.setState({ potentialValues: potentialValues }); });
        }
    };
    RecordPredicate.prototype.createNewRecord = function () {
        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
            predicate: this.props.predicate.uid,
            entity: this.props.entity_id,
            valueType: this.props.predicate.rangeIsReference ? 'entity' : this.props.predicate.range,
            score: 3,
            source: this.props.dataStore.defaultSource
        }), {});
    };
    RecordPredicate.prototype.deleteRecord = function (record) {
        var _this = this;
        if (record.uid === null) {
            throw new Error('Trying to delete a record with null id');
        }
        this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, record.uid)
            .then(function () {
            _this.props.onChange();
        });
    };
    RecordPredicate.prototype.recordChanged = function (record) {
        this.props.dataStore.putItem(falcon_core_1.Record, ApiService_1.AppUrls.record, this.props.entity_id, falcon_core_1.Serializer.toJson(record));
    };
    RecordPredicate.prototype.render = function () {
        var _this = this;
        if (this.props.predicate.uid === null) {
            throw new Error('Expected uid to be a number, it was null');
        }
        return (React.createElement("section", null,
            React.createElement("h5", { className: 'section-header' },
                this.props.predicate.label,
                " ",
                React.createElement("i", { className: 'fa fa-plus-circle add button', "aria-hidden": 'true', onClick: this.createNewRecord.bind(this), title: "Add new " + this.props.predicate.label + " record" }),
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
                React.createElement("tbody", null, this.props.records.map(function (record) { return (React.createElement(RecordEditableFieldComponent, { key: "row-" + record.uid, value: record, onChange: _this.recordChanged.bind(_this), onDelete: _this.deleteRecord.bind(_this), sources: _this.props.sources, entities: _this.state.potentialValues })); })))));
    };
    return RecordPredicate;
}(React.Component));
exports.RecordPredicate = RecordPredicate;
//# sourceMappingURL=RecordPredicate.js.map