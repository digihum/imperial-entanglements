/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const mobx_react_1 = require("mobx-react");
exports.AddTabButton = mobx_react_1.inject('dataStore')(mobx_react_1.observer((props, context) => {
    if (props.dataStore.dataStore.tabs[props.tabType] !== undefined
        && props.uid in props.dataStore.dataStore.tabs[props.tabType]) {
        return (React.createElement("i", { className: 'fa fa-folder-open-o add button', title: 'Open item', onClick: () => context.router.transitionTo(`/edit/${props.tabType}/${props.uid}`) }, " "));
    }
    return (React.createElement("i", { className: 'icon-list-add add button', title: 'Add to list', onClick: () => props.dataStore.createTab(props.tabType, props.uid, 'item', props.data) }));
}));
exports.AddTabButton.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
};
//# sourceMappingURL=AddTabButton.js.map