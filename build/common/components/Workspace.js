/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const React = require("react");
const Loading_1 = require("./Loading");
const mobx_react_1 = require("mobx-react");
const workspace_1 = require("./workspace/workspace");
let Workspace = class Workspace extends React.Component {
    constructor() {
        super();
        this.state = {
            searchString: ''
        };
    }
    render() {
        if (this.props.loading) {
            return (React.createElement(Loading_1.Loading, null));
        }
        if (this.props.list) {
            return (React.createElement(workspace_1.ObjectListWorkspace, { query: this.props.location.query, listType: this.props.workspace }));
        }
        let workspaceComponent = workspace_1.EmptyWorkspace;
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
    }
};
Workspace = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], Workspace);
exports.Workspace = Workspace;
//# sourceMappingURL=Workspace.js.map