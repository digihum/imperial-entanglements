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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var React = require("react");
var Loading_1 = require("./Loading");
var mobx_react_1 = require("mobx-react");
var workspace_1 = require("./workspace/workspace");
var Workspace = (function (_super) {
    __extends(Workspace, _super);
    function Workspace() {
        var _this = _super.call(this) || this;
        _this.state = {
            searchString: ''
        };
        return _this;
    }
    Workspace.prototype.render = function () {
        if (this.props.loading) {
            return (React.createElement(Loading_1.Loading, null));
        }
        if (this.props.list) {
            return (React.createElement(workspace_1.ObjectListWorkspace, { query: this.props.location.query, listType: this.props.workspace }));
        }
        var workspaceComponent = workspace_1.EmptyWorkspace;
        switch (this.props.workspace) {
            case 'entity':
                workspaceComponent = workspace_1.EntityEditorWorkspace;
                break;
            case 'predicate':
                workspaceComponent = workspace_1.PredicateEditorWorkspace;
                break;
            case 'source':
                workspaceComponent = workspace_1.SourceEditorWorkspace;
                break;
            case 'entity_type':
                workspaceComponent = workspace_1.EntityTypeWorkspace;
                break;
            case 'search':
                workspaceComponent = workspace_1.AdvancedSearchWorkspace;
                break;
        }
        return (React.createElement("div", { className: 'flex-fill workspace-outer-wrapper' },
            React.createElement("div", { className: 'workspace-inner-wrapper flex-fill' }, React.createElement(workspaceComponent, { id: this.props.id }))));
    };
    return Workspace;
}(React.Component));
Workspace = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], Workspace);
exports.Workspace = Workspace;
//# sourceMappingURL=Workspace.js.map