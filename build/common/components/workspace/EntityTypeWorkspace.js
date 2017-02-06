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
var SameAsEditor_1 = require("../fields/SameAsEditor");
var ApiService_1 = require("../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var AddTabButton_1 = require("../AddTabButton");
var EditableHeader_1 = require("../fields/EditableHeader");
var EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
var EditableParagraph_1 = require("../fields/EditableParagraph");
var EditableComboDropdown_1 = require("../fields/EditableComboDropdown");
var mobx_react_1 = require("mobx-react");
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
var ParagraphEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableParagraph_1.EditableParagraph);
var SameAsEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(SameAsEditor_1.SameAsEditor);
var ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
var EntityTypeWorkspace = (function (_super) {
    __extends(EntityTypeWorkspace, _super);
    function EntityTypeWorkspace() {
        var _this = _super.call(this) || this;
        _this.state = {};
        return _this;
    }
    EntityTypeWorkspace.prototype.update = function (data) {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        this.props.dataStore.patchItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id, data)
            .then(function () { return _this.setState({ entityType: Object.assign({}, entityType, data) }); });
    };
    EntityTypeWorkspace.prototype.copy = function () {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        var newEntityType = falcon_core_1.Serializer.fromJson(falcon_core_1.EntityType, Object.assign({}, falcon_core_1.Serializer.toJson(entityType), { label: 'Copy of ' + entityType.label }));
        this.props.dataStore.postItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, newEntityType, {})
            .then(function (_a) {
            var id = _a[0];
            _this.props.dataStore.createTab('entity_type', id, 'item');
        });
    };
    EntityTypeWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.id)
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
                                data.entityType.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity_type', datum.uid, 'item');
                                });
                                data.predicate.forEach(function (datum) {
                                    _this.props.dataStore.createTab('predicate', datum.uid, 'item');
                                });
                                data.entity.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.uid, 'item');
                                });
                            }
                        },
                        settings: {
                            conflictingItems: data,
                            message: 'Deleting Entity Type'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    EntityTypeWorkspace.prototype.createEntity = function () {
        var _this = this;
        var a = {
            name: 'entity',
            complete: function (_a) {
                var id = _a[0];
                _this.props.dataStore.createTab('entity', id, 'item');
            },
            cancel: function () { console.log('cancel'); },
            settings: {
                initialName: '',
                initialType: this.props.id
            }
        };
        this.props.modalStore.addModal(a);
    };
    EntityTypeWorkspace.prototype.render = function () {
        var _this = this;
        var entityType = this.props.dataStore.dataStore.tabs.entity_type[this.props.id].value;
        var potentialParents = this.props.dataStore.dataStore.all.entity_type.value;
        var parentName = '';
        if (potentialParents !== null && entityType.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entityType.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        var potentialParentOptions = potentialParents.map(function (par) { return ({ key: par.label, value: par.uid }); });
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity_type' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("div", { className: 'bread-crumbs' }, entityType.parents.map(function (parent, i) {
                            var parentEntityType = _this.props.dataStore.dataStore.all.entity_type.value.find(function (e) { return e.uid === parent; });
                            return (React.createElement("span", { key: "breadcrumb-" + parent },
                                React.createElement("span", null,
                                    "  ",
                                    parentEntityType.label,
                                    " ",
                                    React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: parent }),
                                    " "),
                                React.createElement("i", { className: 'fa fa-angle-right' })));
                        })),
                        React.createElement("i", { className: 'fa fa-tag item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: entityType.label, onChange: function (value) { return _this.update({ 'label': value }); } })),
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
                    React.createElement(ComboEditableFieldComponent, { value: entityType.parent === null ? { key: '', value: null } : { key: parentName, value: entityType.parent }, onChange: function (value) { return _this.update({ 'parent': value === null ? null : value.value }); }, comboSettings: {
                            options: potentialParentOptions,
                            typeName: 'EntityType'
                        } }),
                    entityType.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: entityType.parent })) : null),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement("label", { className: 'small' }, "Description"),
                    React.createElement(ParagraphEditableFieldComponent, { value: entityType.description, onChange: function (value) { return _this.update({ 'description': value }); } })),
                React.createElement("div", { className: 'edit-group' },
                    React.createElement(SameAsEditableFieldComponent, { value: entityType.sameAs, onChange: function (value) { return _this.update({ 'sameAs': value }); } })),
                React.createElement("div", null,
                    React.createElement("h4", null, "Direct Children"),
                    React.createElement("ul", null, entityType.children
                        .map(function (child) { return _this.props.dataStore.dataStore.all.entity_type.value.find(function (et) { return et.uid === child; }); })
                        .map(function (childEt) {
                        if (childEt === undefined) {
                            return null;
                        }
                        //TODO: REMOVE !
                        return (React.createElement("li", { key: "dc-" + childEt.label },
                            childEt.label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity_type', uid: childEt.uid })));
                    }))))));
    };
    return EntityTypeWorkspace;
}(React.Component));
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