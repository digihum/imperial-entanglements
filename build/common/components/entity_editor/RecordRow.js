/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var ScorePicker_1 = require("../fields/ScorePicker");
var ComboDropdown_1 = require("../ComboDropdown");
var StringFieldEditor_1 = require("./StringFieldEditor");
var EntityFieldEditor_1 = require("./EntityFieldEditor");
var DateFieldEditor_1 = require("./DateFieldEditor");
var IntegerFieldEditor_1 = require("./IntegerFieldEditor");
var AddTabButton_1 = require("../AddTabButton");
var formatDate_1 = require("../../helper/formatDate");
var mobx_react_1 = require("mobx-react");
var recordEditor = function (props, record) {
    switch (record.valueType) {
        case 'string':
            return (React.createElement(StringFieldEditor_1.StringFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'date':
            return (React.createElement(DateFieldEditor_1.DateFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'integer':
            return (React.createElement(IntegerFieldEditor_1.IntegerFieldEditor, { value: record.value || '', onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); } }));
        case 'entity':
            return (React.createElement(EntityFieldEditor_1.EntityFieldEditor, { value: record.value === null ? 0 : parseInt(record.value), onChange: function (value) { return props.onChange(Object.assign(record, { value: value })); }, entities: props.entities }));
        default:
            return (React.createElement("div", null, "Missing editor"));
    }
};
var formatValue = function (props, record) {
    if (record.valueType === 'entity') {
        var entity = props.entities.find(function (entity) { return entity.uid == record.value; });
        if (entity !== undefined) {
            if (entity.uid === null) {
                throw Error('Unexpected null ID on entity');
            }
            return (React.createElement("span", null,
                entity.label,
                " ",
                React.createElement(AddTabButton_1.AddTabButton, { uid: entity.uid, tabType: 'entity' })));
        }
        else {
            return (React.createElement("em", null, "Missing Entity"));
        }
    }
    if (record.valueType === 'date') {
        return (React.createElement("span", null, formatDate_1.formatDate(record.value)));
    }
    return (React.createElement("span", null, record.value));
};
exports.RecordRow = mobx_react_1.inject('dataStore', 'modalStore')(mobx_react_1.observer(function (props) {
    var createNewSource = function (initialValue) {
        var a = {
            name: 'source',
            complete: function () {
                // TODO : Automatically reload sources
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialValue: initialValue
            }
        };
        props.modalStore.addModal(a);
    };
    var recordValue = props.value;
    if (recordValue === null) {
        throw new Error('Should not be null!!');
    }
    var currentSource = recordValue.source === null ? undefined :
        props.sources.find(function (source) { return source.uid === recordValue.source; });
    var dropDownValue = {
        key: '', value: recordValue.source === null ? null : recordValue.source
    };
    if (currentSource !== undefined) {
        dropDownValue.key = currentSource.label;
    }
    if (props.edit) {
        return (React.createElement("tr", { className: 'record-row' },
            React.createElement("td", { className: 'record-row-item uid' }, recordValue.uid),
            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, recordEditor(props, recordValue))) : null,
            React.createElement("td", { className: 'record-row-item' },
                React.createElement(ComboDropdown_1.NumberComboDropdown, { options: props.sources.map(function (source) {
                        return ({ key: source.label, value: source.uid !== null ? source.uid : null });
                    }), typeName: 'source', value: dropDownValue, setValue: function (combo) { return props.onChange(Object.assign(recordValue, { source: combo === null ? combo : combo.value })); }, createNewValue: function () { return createNewSource(''); } })),
            React.createElement("td", { className: 'record-row-item score' },
                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: false, onChange: function (score) { return props.onChange(Object.assign(recordValue, { score: score })); } })),
            React.createElement("td", { className: 'record-row-item period' },
                React.createElement(DateFieldEditor_1.DateFieldEditor, { value: recordValue.period || '', onChange: function (period) { return props.onChange(Object.assign(recordValue, { period: period })); } })),
            React.createElement("td", { className: 'record-row-item buttons' },
                React.createElement("button", { onClick: props.acceptChanges },
                    React.createElement("i", { className: 'fa fa-check', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: props.cancelChanges },
                    React.createElement("i", { className: 'fa fa-times', "aria-hidden": 'true' })))));
    }
    else {
        return (React.createElement("tr", { className: 'record-row' },
            React.createElement("td", { className: 'record-row-item uid' },
                "#",
                recordValue.uid),
            recordValue.valueType !== 'source' ? (React.createElement("td", { className: 'record-row-item' }, formatValue(props, recordValue))) : null,
            React.createElement("td", { className: 'record-row-item' },
                dropDownValue.key,
                dropDownValue.key.length > 0 && dropDownValue.value !== null ? (React.createElement(AddTabButton_1.AddTabButton, { uid: dropDownValue.value, tabType: 'source' })) : null),
            React.createElement("td", { className: 'record-row-item score' },
                React.createElement(ScorePicker_1.ScorePicker, { value: recordValue.score, readOnly: true })),
            React.createElement("td", { className: 'record-row-item period' }, formatDate_1.formatDate(recordValue.period)),
            React.createElement("td", { className: 'record-row-item buttons' },
                React.createElement("button", { onClick: props.setEdit },
                    React.createElement("i", { className: 'fa fa-pencil-square-o', title: 'Edit', "aria-hidden": 'true' })),
                React.createElement("button", { onClick: function () { return props.onDelete(props.value); } },
                    React.createElement("i", { className: 'fa fa-trash', "aria-hidden": 'true' })))));
    }
}));
//# sourceMappingURL=RecordRow.js.map