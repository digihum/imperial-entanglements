/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const EntityList_1 = require("../object_list/EntityList");
const PredicateList_1 = require("../object_list/PredicateList");
const SourceList_1 = require("../object_list/SourceList");
const EntityTypeList_1 = require("../object_list/EntityTypeList");
exports.ObjectListWorkspace = (props) => (React.createElement("div", { className: 'workspace-editor object-list' }, (() => {
    switch (props.listType) {
        case 'entity':
            return (React.createElement(EntityList_1.EntityList, { query: props.query }));
        case 'source':
            return (React.createElement(SourceList_1.SourceList, null));
        case 'predicate':
            return (React.createElement(PredicateList_1.PredicateList, null));
        case 'entity_type':
            return (React.createElement(EntityTypeList_1.EntityTypeList, null));
    }
})()));
//# sourceMappingURL=ObjectListWorkspace.js.map