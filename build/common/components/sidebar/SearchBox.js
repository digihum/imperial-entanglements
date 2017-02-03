/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const ComboDropdown_1 = require("../ComboDropdown");
const ApiService_1 = require("../../ApiService");
exports.SearchBox = (props, context) => {
    const entities = props.dataStore.dataStore.all.entity.value.map((entity) => ({ key: entity.label, value: `${ApiService_1.AppUrls.entity}/${entity.uid}` }));
    const entityTypes = props.dataStore.dataStore.all.entity_type.value.map((entityType) => ({ key: entityType.label, value: `${ApiService_1.AppUrls.entity_type}/${entityType.uid}` }));
    const predicates = props.dataStore.dataStore.all.predicate.value.map((predicate) => ({ key: predicate.label, value: `${ApiService_1.AppUrls.predicate}/${predicate.uid}` }));
    const sources = props.dataStore.dataStore.all.source.value.map((source) => ({ key: source.label, value: `${ApiService_1.AppUrls.source}/${source.uid}` }));
    const all = entities.concat(entityTypes, predicates, sources);
    return (React.createElement("span", null,
        React.createElement("div", { className: 'input-addon-formgroup' },
            React.createElement("span", { className: 'input-addon-icon' },
                React.createElement("i", { className: 'fa fa-search fa-fw' })),
            React.createElement(ComboDropdown_1.StringComboDropdown, { value: { key: '', value: null }, setValue: (val) => {
                    if (val !== null) {
                        context.router.transitionTo(`/edit/${val.value}`);
                    }
                }, typeName: 'all', options: all, allowNew: false, createNewValue: () => { } }))));
};
exports.SearchBox.contextTypes = { router: React.PropTypes.object.isRequired };
//# sourceMappingURL=SearchBox.js.map