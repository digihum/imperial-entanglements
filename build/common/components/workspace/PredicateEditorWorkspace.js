/**
 * @fileOverview Predicate editor workspace
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
const react_router_1 = require("react-router");
const SameAsEditor_1 = require("../fields/SameAsEditor");
const ApiService_1 = require("../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const EditableHeader_1 = require("../fields/EditableHeader");
const EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
const EditableParagraph_1 = require("../fields/EditableParagraph");
const PredicateDescription_1 = require("../fields/PredicateDescription");
const literalTypes_1 = require("../../literalTypes");
const mobx_react_1 = require("mobx-react");
const HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
const ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
const SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
let PredicateEditorWorkspace = class PredicateEditorWorkspace extends React.Component {
    constructor() {
        super();
        this.state = {
            records: []
        };
    }
    updatePredicate(field, value, rangeIsReferenceOverride = null) {
        const predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        if (predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }
        const rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? predicate.rangeIsReference : rangeIsReferenceOverride;
        this.props.dataStore.patchItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, predicate.uid, {
            [field]: value,
            rangeIsReference: rangeIsReferenceVal
        });
    }
    copy() {
        const predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        const newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, Object.assign({}, falcon_core_1.Serializer.toJson(predicate), { label: 'Copy of ' + predicate.label }));
        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})
            .then(([id]) => {
            this.props.dataStore.createTab('predicate', id, 'item');
        });
    }
    del() {
        this.props.dataStore.delItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, this.props.id)
            .then(() => this.context.router.transitionTo('/edit/notfound'))
            .catch((e) => {
            if (e.code === 404) {
                this.context.router.transitionTo('/edit/notfound');
            }
            if (e.code === 422) {
                e.data.then((data) => {
                    const conflictResolutionModal = {
                        name: 'conflict_resolution',
                        cancel: () => { },
                        complete: (result) => {
                            if (result === 'addToWorkspace') {
                                data.forEach((datum) => {
                                    this.props.dataStore.createTab('entity', datum.entity, 'item');
                                });
                            }
                            if (result === 'deleteAll') {
                                Promise.all(data.record.map((datum) => this.props.dataStore.delItem(falcon_core_1.Record, ApiService_1.AppUrls.record, datum.uid)))
                                    .then(() => {
                                    this.del();
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Predicate'
                        }
                    };
                    this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    }
    render() {
        const predicate = this.props.dataStore.dataStore.tabs.predicate[this.props.id].value;
        const entityTypes = this.props.dataStore.dataStore.all.entity_type.value;
        const currentDomainEntityType = entityTypes.find((t) => t.uid == predicate.domain);
        let currentDomainEntityTypeName = '';
        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.label;
        }
        const domain = { key: currentDomainEntityTypeName, value: predicate.domain };
        const range = { key: '', value: {
                isReference: predicate.rangeIsReference,
                value: predicate.range
            } };
        if (predicate.rangeIsReference) {
            const currentRangeEntityType = entityTypes.find((t) => t.uid === predicate.range);
            if (currentRangeEntityType !== undefined) {
                range.key = currentRangeEntityType.label;
            }
        }
        else {
            const literalType = literalTypes_1.literalTypes.find((t) => t.value === predicate.range);
            if (literalType !== undefined) {
                range.key = literalType.label;
            }
        }
        const entityTypeOptions = entityTypes.map((t) => {
            if (t.uid === null) {
                throw new Error('Encountered entity type with no id!');
            }
            return { key: t.label, value: t.uid };
        });
        const literalTypeOptions = literalTypes_1.literalTypes.map((t) => ({ key: t.label, value: { value: t.label, isReference: false } }));
        const entityTypeMap2 = entityTypeOptions.map((e) => ({ key: e.key, value: { isReference: true, value: e.value.toString() } }));
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header predicate' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("i", { className: 'fa fa-long-arrow-right item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: predicate.label, onChange: (value) => this.updatePredicate('label', value) })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'predicate selected' }, "CORE"),
                        React.createElement("div", { style: { display: 'none' }, className: 'predicate' }, "SAME AS")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", null,
                    React.createElement(react_router_1.Link, { to: `/edit/entity?col1p=${this.props.id}&col1f=exists` },
                        "Uses: ",
                        predicate.uses)),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: predicate.description, onChange: (value) => this.updatePredicate('description', value) })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Typing"),
                    React.createElement(PredicateDescription_1.PredicateDescription, { domain: domain, range: range, domainChanged: (value) => this.updatePredicate('domain', value.value), rangeChanged: (value) => this.updatePredicate('range', value.value.value, value.value.isReference), mode: 'editSingle', domainOptions: entityTypeOptions, rangeOptions: literalTypeOptions.concat(entityTypeMap2) })),
                React.createElement("div", null,
                    React.createElement(SameAsEditableFieldComponent, { value: predicate.sameAs, onChange: (value) => this.updatePredicate('sameAs', value) })))));
    }
};
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