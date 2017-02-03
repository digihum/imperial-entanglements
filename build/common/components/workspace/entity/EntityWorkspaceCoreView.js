/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const RecordsEditor_1 = require("../../entity_editor/RecordsEditor");
const ApiService_1 = require("../../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const lodash_1 = require("lodash");
const AddTabButton_1 = require("../../AddTabButton");
const findParentTree_1 = require("../../../helper/findParentTree");
const EditableFieldComponent_1 = require("../../fields/EditableFieldComponent");
const EditableComboDropdown_1 = require("../../fields/EditableComboDropdown");
const ComboEditableFieldComponent = EditableFieldComponent_1.EditableFieldHOC(EditableComboDropdown_1.EditableComboDropdown);
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
class EntityWorkspaceCoreView extends React.Component {
    constructor(props, context) {
        super();
        this.state = {
            comboValue: { key: 'test', value: null },
            comboSearchValue: ''
        };
    }
    update(data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    }
    render() {
        const entity = this.props.dataStore.dataStore.tabs.entity[this.props.id].value.entity;
        const entityType = this.props.dataStore.dataStore.all.entity_type.value.find((t) => t.uid === entity.entityType);
        if (entityType === undefined || entityType.uid === null) {
            throw new Error('Encountered undefined entity type or entity type with null id');
        }
        const potentialParents = this.props.dataStore.dataStore.all.entity.value;
        const entityTypeParents = findParentTree_1.findParentTree(entity.entityType, this.props.dataStore.dataStore.all.entity_type.value);
        const predicates = this.props.dataStore.dataStore.all.predicate
            .value.filter((pred) => entityTypeParents.indexOf(pred.domain) !== -1);
        const sources = this.props.dataStore.dataStore.all.source.value;
        const records = lodash_1.groupBy(this.props.dataStore.dataStore.tabs.entity[this.props.id].value.records, 'predicate');
        const options = predicates.map((pred) => ({ key: pred.label, value: pred.uid, meta: pred }));
        let parentName = '';
        if (potentialParents !== null && entity.parent !== undefined) {
            const found = potentialParents.find((par) => par.uid === entity.parent);
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
                    React.createElement(ComboEditableFieldComponent, { value: { key: parentName, value: entity.parent }, onChange: (value) => this.update({ 'parent': value === null ? null : value.value }), comboSettings: {
                            options: potentialParents.map((par) => ({ key: par.label, value: par.uid })),
                            typeName: 'Entity'
                        } }),
                    entity.parent !== null ? (React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: entity.parent })) : null)),
            React.createElement("div", { className: 'edit-group' },
                React.createElement(RecordsEditor_1.RecordsEditor, { dimension: 'predicates', entityExists: true, id: this.props.id, records: records, onChange: () => { }, predicates: predicates, sources: sources, entityTypeId: entityType.uid }))));
    }
}
EntityWorkspaceCoreView.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.EntityWorkspaceCoreView = EntityWorkspaceCoreView;
//# sourceMappingURL=EntityWorkspaceCoreView.js.map