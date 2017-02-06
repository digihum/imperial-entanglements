/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var EntityList_1 = require("../object_list/EntityList");
var PredicateList_1 = require("../object_list/PredicateList");
var SourceList_1 = require("../object_list/SourceList");
var EntityTypeList_1 = require("../object_list/EntityTypeList");
exports.ObjectListWorkspace = function (props) { return (React.createElement("div", { className: 'workspace-editor object-list' }, (function () {
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
})())); };
//# sourceMappingURL=ObjectListWorkspace.js.map