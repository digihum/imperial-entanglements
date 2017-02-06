/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const ApiService_1 = require("../../../ApiService");
const falcon_core_1 = require("@digihum/falcon-core");
const AddTabButton_1 = require("../../AddTabButton");
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
class EntityWorkspaceReferenceView extends React.Component {
    constructor(props, context) {
        super();
        this.state = {
            comboValue: { key: 'test', value: '' },
            comboSearchValue: ''
        };
    }
    update(data) {
        this.props.dataStore.patchItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, this.props.id, data);
    }
    render() {
        return (React.createElement("section", { className: 'editor-body' },
            React.createElement("h2", null, "References"),
            React.createElement("table", { className: 'table' },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Entity"),
                        React.createElement("th", null, "Property"))),
                React.createElement("tbody", null, this.props.dataStore.dataStore.tabs.entity[this.props.id].value.referenceRecords.map((record) => {
                    return (React.createElement("tr", { key: `record-${record.uid}` },
                        React.createElement("td", null,
                            this.props.dataStore.dataStore.all.entity.value.find((entity) => entity.uid === record.entity).label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'entity', uid: record.entity })),
                        React.createElement("td", null,
                            this.props.dataStore.dataStore.all.predicate.value.find((predicate) => predicate.uid === record.predicate).label,
                            " ",
                            React.createElement(AddTabButton_1.AddTabButton, { tabType: 'predicate', uid: record.predicate }))));
                })))));
    }
}
EntityWorkspaceReferenceView.contextTypes = {
    router: React.PropTypes.object.isRequired
};
exports.EntityWorkspaceReferenceView = EntityWorkspaceReferenceView;
//# sourceMappingURL=EntityWorkspaceReferenceView.js.map