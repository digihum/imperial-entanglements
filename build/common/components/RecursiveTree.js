/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const React = require("react");
const AddTabButton_1 = require("./AddTabButton");
class RecursiveTree extends React.Component {
    constructor() {
        super();
        this.state = { collapsed: false };
    }
    render() {
        const filtered = this.props.data.filter((datum) => datum.parent === this.props.parentId);
        if (filtered.length === 0) {
            return null;
        }
        return (React.createElement("div", null, filtered.map((item) => (React.createElement("div", { key: item.label },
            React.createElement("div", { className: 'tree-label', onClick: () => this.setState({ collapsed: !this.state.collapsed }) },
                "- ",
                item.label,
                " ",
                React.createElement(AddTabButton_1.AddTabButton, { uid: item.uid, tabType: this.props.tabType })),
            !this.state.collapsed ? (React.createElement("div", { className: 'tree-children' },
                React.createElement(RecursiveTree, { dataStore: this.props.dataStore, data: this.props.data, tabType: this.props.tabType, parentId: item.uid }))) : null)))));
    }
}
exports.RecursiveTree = RecursiveTree;
//# sourceMappingURL=RecursiveTree.js.map