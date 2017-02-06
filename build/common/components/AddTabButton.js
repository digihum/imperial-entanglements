/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var React = require("react");
var mobx_react_1 = require("mobx-react");
exports.AddTabButton = mobx_react_1.inject('dataStore')(mobx_react_1.observer(function (props, context) {
    if (props.dataStore.dataStore.tabs[props.tabType] !== undefined
        && props.uid in props.dataStore.dataStore.tabs[props.tabType]) {
        return (React.createElement("i", { className: 'fa fa-folder-open-o add button', title: 'Open item', onClick: function () { return context.router.transitionTo("/edit/" + props.tabType + "/" + props.uid); } }, " "));
    }
    return (React.createElement("i", { className: 'icon-list-add add button', title: 'Add to list', onClick: function () { return props.dataStore.createTab(props.tabType, props.uid, 'item', props.data); } }));
}));
exports.AddTabButton.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
};
//# sourceMappingURL=AddTabButton.js.map
