/**
 * @fileOverview Empty workspace for when nothing is open!
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
var findParentTree_1 = require("../../helper/findParentTree");
var EditableHeader_1 = require("../fields/EditableHeader");
var EditableFieldComponent_1 = require("../fields/EditableFieldComponent");
var EntityWorkspaceCoreView_1 = require("./entity/EntityWorkspaceCoreView");
var EntityWorkspaceReferenceView_1 = require("./entity/EntityWorkspaceReferenceView");
var mobx_react_1 = require("mobx-react");
var HeaderEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableHeader_1.EditableHeader);
// What can I do?
// Entity Operations
// - Delete the entity
// - Merge the entity
// - Split the entity
// - Add 'same-as-ses' to the entity
// Records
// - Order records by type, source and date
// - Add new records
// - Adding a new predicate creates a new record with the
//   entity set, the predicate set, the score set to 3, the period set to null, source set to null
//   it also creates a blank entry in the records sub table based on the range of the predicate.
// - New predicates must have a name. The domain is set to the current entitytype but can be changed
//   to one of its parents. The range MUST be set.
// Visualisations:
// - Network graph of entity relationships
var EntityEditorWorkspace = (function (_super) {
    __extends(EntityEditorWorkspace, _super);
    function EntityEditorWorkspace(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            tab: 0
        };
        return _this;
    }
    EntityEditorWorkspace.prototype.del = function () {
        var _this = this;
        this.props.dataStore.delItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id)
            .then(function () {
            _this.props.dataStore.closeTab('entity', _this.props.id);
            _this.context.router.transitionTo('/edit/notfound');
        })
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
                                data.record.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.entity, 'item');
                                });
                                data.entity.forEach(function (datum) {
                                    _this.props.dataStore.createTab('entity', datum.uid, 'item');
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
                            message: 'Deleting Entity'
                        }
                    };
                    _this.props.modalStore.addModal(conflictResolutionModal);
                });
            }
        });
    };
    EntityEditorWorkspace.prototype.createNewRecord = function () {
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        if (entityType === undefined) {
            throw new Error('Encountered undefined entity type!');
        }
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
                entityType: entityType.uid
            }
        };
        this.props.modalStore.addModal(modalDef);
    };
    EntityEditorWorkspace.prototype.update = function (data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    };
    EntityEditorWorkspace.prototype.clone = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
            label: 'Copy of ' + entity.label,
            entityType: entity.entityType
        }), { clone: this.props.id }).then(function (_a) {
            var id = _a[0];
            return _this.props.dataStore.createTab('entity', id, 'item');
        });
    };
    EntityEditorWorkspace.prototype.render = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var potentialParents = this.props.dataStore.dataStore.all.entity.value;
        var parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entity.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        return (React.createElement("div", { className: 'workspace-editor' },
            React.createElement("header", { className: 'editor-header entity' },
                React.createElement("div", { className: 'primary-toolbar' },
                    React.createElement("div", { className: 'main-toolbar' },
                        React.createElement("i", { className: 'fa fa-cube item-icon' }),
                        React.createElement(HeaderEditableFieldComponent, { value: entity.label, onChange: function (value) { return _this.update({ 'label': value }); } })),
                    React.createElement("div", { className: 'sub-toolbar' },
                        React.createElement("i", { className: 'fa fa-trash delete button', "aria-hidden": 'true', onClick: this.del.bind(this) }),
                        React.createElement("i", { className: 'fa fa-clone button', "aria-hidden": 'true', onClick: this.clone.bind(this) }))),
                React.createElement("div", { className: 'secondary-toolbar' },
                    React.createElement("div", { className: 'tab-bar' },
                        React.createElement("div", { className: 'entity ' + (this.state.tab === 0 ? 'selected' : ''), onClick: function () { return _this.setState({ tab: 0 }); } }, "CORE"),
                        React.createElement("div", { className: 'entity ' + (this.state.tab === 1 ? 'selected' : ''), onClick: function () { return _this.setState({ tab: 1 }); } }, "REFERENCED BY")))),
            this.state.tab === 0 ? (React.createElement(EntityWorkspaceCoreView_1.EntityWorkspaceCoreView, { dataStore: this.props.dataStore, id: this.props.id })) : (React.createElement(EntityWorkspaceReferenceView_1.EntityWorkspaceReferenceView, { dataStore: this.props.dataStore, id: this.props.id }))));
    };
    return EntityEditorWorkspace;
}(React.Component));
EntityEditorWorkspace.contextTypes = {
    router: React.PropTypes.object.isRequired,
    manager: React.PropTypes.object.isRequired
};
EntityEditorWorkspace = __decorate([
    mobx_react_1.inject('dataStore', 'modalStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object, Object])
], EntityEditorWorkspace);
exports.EntityEditorWorkspace = EntityEditorWorkspace;
//# sourceMappingURL=EntityEditorWorkspace.js.map