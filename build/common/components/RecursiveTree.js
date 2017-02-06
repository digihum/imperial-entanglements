/**
 * @fileOverview Sidebar for editor
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
var AddTabButton_1 = require("./AddTabButton");
var RecursiveTree = (function (_super) {
    __extends(RecursiveTree, _super);
    function RecursiveTree() {
        var _this = _super.call(this) || this;
        _this.state = { collapsed: false };
        return _this;
    }
    RecursiveTree.prototype.render = function () {
        var _this = this;
        var filtered = this.props.data.filter(function (datum) { return datum.parent === _this.props.parentId; });
        if (filtered.length === 0) {
            return null;
        }
        return (React.createElement("div", null, filtered.map(function (item) { return (React.createElement("div", { key: item.label },
            React.createElement("div", { className: 'tree-label', onClick: function () { return _this.setState({ collapsed: !_this.state.collapsed }); } },
                "- ",
                item.label,
                " ",
                React.createElement(AddTabButton_1.AddTabButton, { uid: item.uid, tabType: _this.props.tabType })),
            !_this.state.collapsed ? (React.createElement("div", { className: 'tree-children' },
                React.createElement(RecursiveTree, { dataStore: _this.props.dataStore, data: _this.props.data, tabType: _this.props.tabType, parentId: item.uid }))) : null)); })));
    };
    return RecursiveTree;
}(React.Component));
exports.RecursiveTree = RecursiveTree;
//# sourceMappingURL=RecursiveTree.js.map