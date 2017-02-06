/**
 * @fileOverview Predicate editor workspace
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
var react_router_1 = require("react-router");
var SameAsEditor_1 = require("../fields/SameAsEditor");
var ApiService_1 = require("../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var EditableHeader_1 = require("../fields/EditableHeader");
var EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
var EditableParagraph_1 = require("../fields/EditableParagraph");
var PredicateDescription_1 = require("../fields/PredicateDescription");
var literalTypes_1 = require("../../literalTypes");
var mobx_react_1 = require("mobx-react");
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
var ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
var SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
var PredicateEditorWorkspace = (function (_super) {
    __extends(PredicateEditorWorkspace, _super);
    function PredicateEditorWorkspace() {
        var _this = _super.call(this) || this;
        _this.state = {
            records: []
        };
        return _this;
    }
    PredicateEditorWorkspace.prototype.updatePredicate = function (field, value, rangeIsReferenceOverride) {
        if (rangeIsReferenceOverride === void 0) { rangeIsReferenceOverride = null; }
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        if (predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }
        var rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? predicate.rangeIsReference : rangeIsReferenceOverride;
        this.props.dataStore.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, predicate.uid, (_a = {},
            _a[field] = value,
            _a.rangeIsReference = rangeIsReferenceVal,
            _a));
        var _a;
    };
    PredicateEditorWorkspace.prototype.copy = function () {
        var _this = this;
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        var newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, Object.assign({}, falcon_core_1.Serializer.toJson(predicate), { label: 'Copy of ' + predicate.label }));
        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})
            .then(function (_a) {
            var id = _a[0];
            _this.props.dataStore.createTab('predicate', id, 'item');
        });
    };
    PredicateEditorWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, this.props.id)
            .then(function () { return _this.context.router.transitionTo('/edit/notfound'); })
            .catch(function (e) {
            if (e.code === 404) {
                _this.context.router.transitionTo('/edit/notfound');
            }
            if (e.code === 422) {
                e.data.then(function (data) {
                    var conflictResolutionModal = {
                        name: 'conflict_resolution',
                        cancel: function () { },
                        complete: function (result) {
                            if (result === 'addToWorkspace') {
                                data.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.entity, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.record.map(function (datum) { return _this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid); }))
                                    .then(function () {
                                    _this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Predicate'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    PredicateEditorWorkspace.prototype.render = function () {
        var _this = this;
        var predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        var entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
        var currentDomainEntityType = entityTypes.find(function (t) { return t.uid == predicate.domain; });
        var currentDomainEntityTypeName = '';
        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.label;
        }
        var domain = { key: currentDomainEntityTypeName, value: predicate.domain };
        var range = { key: '', value: {
                isReference: predicate.rangeIsReference,
                value: predicate.range
            } };
        if (predicate.rangeIsReference) {
            var currentRangeEntityType = entityTypes.find(function (t) { return t.uid === predicate.range; });
            if (currentRangeEntityType !== undefined) {
                range.key = currentRangeEntityType.label;
            }
        }
        else {
            var literalType = literalTypes_1.literalTypes.find(function (t) { return t.value === predicate.range; });
            if (literalType !== undefined) {
                range.key = literalType.label;
            }
        }
        var entityTypeOptions = entityTypes.map(function (t) {
            if (t.uid === null) {
                throw new Error('Encountered entity type with no id!');
            }
            return { key: t.label, value: t.uid };
        });
        var literalTypeOptions = literalTypes_1.literalTypes.map(function (t) { return ({ key: t.label, value: { value: t.label, isReference: false } }); });
        var entityTypeMap2 = entityTypeOptions.map(function (e) { return ({ key: e.key, value: { isReference: true, value: e.value.toString() } }); });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header predicate' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("i", { className: 'fa fa-long-arrow-right item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: predicate.label, onChange: function (value) { return _this.updatePredicate('label', value); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'predicate selected' }, "CORE"),
                        React.createElement("div", { style: { display: 'none' }, className: 'predicate' }, "SAME AS")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", null,
                    React.createElement(react_router_1.Link, { to: "/edit/entity?col1p=" + this.props.id + "&col1f=exists" },
                        "Uses: ",
                        predicate.uses)),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: predicate.description, onChange: function (value) { return _this.updatePredicate('description', value); } })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Typing"),
                    React.createElement(PredicateDescription_1.PredicateDescription, { domain: domain, range: range, domainChanged: function (value) { return _this.updatePredicate('domain', value.value); }, rangeChanged: function (value) { return _this.updatePredicate('range', value.value.value, value.value.isReference); }, mode: 'editSingle', domainOptions: entityTypeOptions, rangeOptions: literalTypeOptions.concat(entityTypeMap2) })),
                React.createElement("div", null,
                    React.createElement(SameAsEditableFieldComponent, { value: predicate.sameAs, onChange: function (value) { return _this.updatePredicate('sameAs', value); } })))));
    };
    return PredicateEditorWorkspace;
}(React.Component));
PredicateEditorWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired
};
PredicateEditorWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], PredicateEditorWorkspace);
exports.PredicateEditorWorkspace = PredicateEditorWorkspace;
//# sourceMappingURL=PredicateEditorWorkspace.js.map