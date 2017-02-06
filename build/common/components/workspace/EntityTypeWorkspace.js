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
const SameAsEditor_1 = require("../fields/SameAsEditor");
const ApiService_1 = require("../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const AddTabButton_1 = require("../AddTabButton");
const EditableHeader_1 = require("../fields/EditableHeader");
const EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
const EditableParagraph_1 = require("../fields/EditableParagraph");
const EditableComboDropdown_1 = require("../fields/EditableComboDropdown");
const mobx_react_1 = require("mobx-react");
const HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
const ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
const SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
const ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
let EntityTypeWorkspace = class EntityTypeWorkspace extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    update(data) {
        const entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        this.props.dataStore.patchItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id, data)
            .then(() => this.setState({ entityType: Object.assign({}, entityType, data) }));
    }
    copy() {
        const entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        const newEntityType = falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, Object.assign({}, falcon_core_1.Serializer.toJson(entityType), { label: 'Copy of ' + entityType.label }));
        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, newEntityType, {})
            .then(([id]) => {
            this.props.dataStore.createTab('entity_type', id, 'item');
        });
    }
    del() {
        this.props.dataStore.delItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id)
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
                                data.entityType.forEach((datum) => {
                                    this.props.dataStore.createTab('entity_type', datum.uid, 'item');
                                });
                                data.predicate.forEach((datum) => {
                                    this.props.dataStore.createTab('predicate', datum.uid, 'item');
                                });
                                data.entity.forEach((datum) => {
                                    this.props.dataStore.createTab('entity', datum.uid, 'item');
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Entity Type'
                        }
                    };
                    this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    }
    createEntity() {
        const a = {
            name: 'entity',
            complete: ([id]) => {
                this.props.dataStore.createTab('entity', id, 'item');
            },
            cancel: () => { console.log('cancel'); },
            settings: {
                initialName: '',
                initialType: this.props.id
            }
        };
        this.props.modalStore.addModal(a);
    }
    render() {
        const entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        const potentialParents = this.props.dataStore.dataStore.all.entity_type.value;
        let parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entityType.parent);
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        const potentialParentOptions = potentialParents.map((par) => ({ key: par.label, value: par.uid }));
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity_type' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("div", { className: 'bread-crumbs' }, entityType.parents.map((parent, i) => {
                            const parentEntityType = this.props.dataStore.dataStore.all.entity_type.value.find((e) => e.uid === parent);
                            return (React.createElement("span", { key: `breadcrumb-${parent}` },
                                React.createElement("span", null,
                                    "  ",
                                    parentEntityType.label,
                                    " ",
                                    React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: parent }),
                                    " "),
                                React.createElement("i", { className: 'fa fa-angle-right' })));
                        })),
                        React.createElement("i", { className: 'fa fa-tag item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: entityType.label, onChange: (value) => this.update({ 'label': value }) })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-plus add button', "aria-hidden": 'true', onClick: this.createEntity.bind(this) }),
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.copy.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity_type selected' }, "CORE")))),
            React.createElement("section", { className: 'editor-body' },
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: entityType.parent === null ? { key: '', value: null } : { key: parentName, value: entityType.parent }, onChange: (value) => this.update({ 'parent': value === null ? null : value.value }), comboSettings: {
                            options: potentialParentOptions,
                            typeName: 'EntityType'
                        } }),
                    entityType.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: entityType.parent })) : null),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: entityType.description, onChange: (value) => this.update({ 'description': value }) })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement(SameAsEditableFieldComponent, { value: entityType.sameAs, onChange: (value) => this.update({ 'sameAs': value }) })),
                React.createElement("div", null,
                    React.createElement("h4", null, "Direct Children"),
                    React.createElement("ul", null, entityType.children
                        .map((child) => this.props.dataStore.dataStore.all.entity_type.value.find((et) => et.uid === child))
                        .map((childEt) => {
                        if (childEt === undefined) {
                            return null;
                        }
                        //TODO: REMOVE !
                        return (React.createElement("li", { key: `dc-${childEt.label}` },
                            childEt.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: childEt.uid })));
                    }))))));
    }
};
EntityTypeWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired
};
EntityTypeWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], EntityTypeWorkspace);
exports.EntityTypeWorkspace = EntityTypeWorkspace;
//# sourceMappingURL=EntityTypeWorkspace.js.map