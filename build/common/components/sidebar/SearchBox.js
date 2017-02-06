/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var ComboDropdown_1 = require("../ComboDropdown");
var ApiService_1 = require("../../ApiService");
exports.SearchBox = function (props, context) {
    var entities = props.dataStore.dataStore.all.entity.value.map(function (entity) {
        return ({ key: entity.label, value: ApiService_1.AppUrls.entity + "/" + entity.uid });
    });
    var entityTypes = props.dataStore.dataStore.all.entity_type.value.map(function (entityType) {
        return ({ key: entityType.label, value: ApiService_1.AppUrls.entity_type + "/" + entityType.uid });
    });
    var predicates = props.dataStore.dataStore.all.predicate.value.map(function (predicate) {
        return ({ key: predicate.label, value: ApiService_1.AppUrls.predicate + "/" + predicate.uid });
    });
    var sources = props.dataStore.dataStore.all.source.value.map(function (source) {
        return ({ key: source.label, value: ApiService_1.AppUrls.source + "/" + source.uid });
    });
    var all = entities.concat(entityTypes, predicates, sources);
    return (React.createElement("span", null,
        React.createElement("div", { className: 'input-addon-formgroup' },
            React.createElement("span", { className: 'input-addon-icon' },
                React.createElement("i", { className: 'fa fa-search fa-fw' })),
            React.createElement(ComboDropdown_1.StringComboDropdown, { value: { key: '', value: null }, setValue: function (val) {
                    if (val !== null) {
                        context.router.transitionTo("/edit/" + val.value);
                    }
                }, typeName: 'all', options: all, allowNew: false, createNewValue: function () { } }))));
};
exports.SearchBox.contextTypes = { router: React.PropTypes.object.isRequired };
//# sourceMappingURL=SearchBox.js.map