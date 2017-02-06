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
var React = require("react");
var RecordsEditor_1 = require("../../entity_editor/RecordsEditor");
var ApiService_1 = require("../../../ApiService");
var falcon_core_1 = require("@digihum/falcon-core");
var lodash_1 = require("lodash");
var AddTabButton_1 = require("../../AddTabButton");
var findParentTree_1 = require("../../../helper/findParentTree");
var EditableFieldComponent_1 = require("../../fields/EditableFieldComponent");
var EditableComboDropdown_1 = require("../../fields/EditableComboDropdown");
var ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
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
var EntityWorkspaceCoreView = (function (_super) {
    __extends(EntityWorkspaceCoreView, _super);
    function EntityWorkspaceCoreView(props, context) {
        var _this = _super.call(this) || this;
        _this.state = {
            comboValue: { key: 'test', value: null },
            comboSearchValue: ''
        };
        return _this;
    }
    EntityWorkspaceCoreView.prototype.update = function (data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    };
    EntityWorkspaceCoreView.prototype.render = function () {
        var _this = this;
        var entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        var entityType = this.props.dataStore.dataStore.all.entity_type.value.find(function (t) { return t.uid === entity.entityType; });
        if (entityType === undefined || entityType.uid === null) {
            throw new Error('Encountered undefined entity type or entity type with null id');
        }
        var potentialParents = this.props.dataStore.dataStore.all.entity.value;
        var entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        var predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter(function (pred) { return entityTypeParents.indexOf(pred.domain) !== -1; });
        var sources = this.props.dataStore.dataStore.all.source.value;
        var records = lodash_1.groupBy(this.props.dataStore.dataStore.tabs.entity[this.props.id].value.records, 'predicate');
        var options = predicates.map(function (pred) { return ({ key: pred.label, value: pred.uid, meta: pred }); });
        var parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            var found = potentialParents.find(function (par) { return par.uid === entity.parent; });
            if (found !== undefined) {
                parentName = found.label;
            }
        }
        return (React.createElement("section", { className: 'editor-body' },
            React.createElement("div", { className: 'flex-fill' },
                React.createElement("div", { className: 'flex-fill' },
                    React.createElement("div", null,
                        React.createElement("label", { className: 'small' }, "Type"),
                        entityType.label,
                        " ",
                        React.createElement(AddTabButton_1.AddTabButton, { uid: entityType.uid, tabType: 'entity_type' }))),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("label", { className: 'small' }, "Parent"),
                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: entity.parent }, onChange: function (value) { return _this.update({ 'parent': value === null ? null : value.value }); }, comboSettings: {
                            options: potentialParents.map(function (par) { return ({ key: par.label, value: par.uid }); }),
                            typeName: 'Entity'
                        } }),
                    entity.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: entity.parent })) : null)),
            React.createElement("div", { className: 'edit-group' },
                React.createElement(RecordsEditor_1.RecordsEditor, { dimension: 'predicates', entityExists: true, id: this.props.id, records: records, onChange: function () { }, predicates: predicates, sources: sources, entityTypeId: entityType.uid }))));
    };
    return EntityWorkspaceCoreView;
}(React.Component));
EntityWorkspaceCoreView.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.EntityWorkspaceCoreView = EntityWorkspaceCoreView;
//# sourceMappingURL=EntityWorkspaceCoreView.js.map