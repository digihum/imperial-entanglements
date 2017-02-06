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
const Overlay_1 = require("../Overlay");
const falcon_core_1 = require("@digihum/falcon-core");
const ApiService_1 = require("../../ApiService");
const ComboDropdown_1 = require("../ComboDropdown");
const lodash_1 = require("lodash");
const mobx_react_1 = require("mobx-react");
let CreateEntity = class CreateEntity extends React.Component {
    constructor() {
        super();
        this.state = {
            label: '',
            entityType: { key: '', value: null },
            allEntityTypes: []
        };
    }
    componentWillMount() {
        this.props.dataStore.getCollection(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, {})
            .then((allEntityTypes) => {
            if (this.props.initialType !== undefined) {
                const initialType = allEntityTypes.find((et) => et.uid === this.props.initialType);
                if (initialType === undefined) {
                    throw new Error('Invalid initial type');
                }
                if (initialType.uid === null) {
                    throw new Error('found entity type with null uid');
                }
                this.setState({
                    entityType: { key: initialType.label, value: initialType.uid }
                });
            }
            this.setState({ allEntityTypes });
        });
    }
    createEntity() {
        if (this.state.entityType === null) {
            throw new Error('Cannot create entity with null type');
        }
        this.props.dataStore.postItem(falcon_core_1.Entity, ApiService_1.AppUrls.entity, falcon_core_1.Serializer.fromJson(falcon_core_1.Entity, {
            label: this.state.label,
            entityType: this.state.entityType.value
        }), {})
            .then((a) => this.props.complete(a[0].toString()));
    }
    render() {
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Entity"),
            React.createElement("label", { className: 'small' }, "Label"),
            React.createElement("input", { type: 'text', value: this.state.label, ref: (a) => { if (a !== null)
                    a.focus(); }, name: 'new-entity-name', className: 'gap', onChange: (e) => this.setState({ label: e.target.value }) }),
            React.createElement("label", { className: 'small' }, "Type"),
            React.createElement(ComboDropdown_1.NumberComboDropdown, { options: this.state.allEntityTypes.map((t) => ({ key: t.label, value: t.uid })), typeName: 'entity type', value: this.state.entityType, setValue: (entityType) => this.setState({ entityType }), createNewValue: lodash_1.noop, allowNew: false }),
            React.createElement("button", { name: 'cancel-modal', onClick: () => this.props.cancel(), className: 'pull-left' }, "Cancel"),
            React.createElement("button", { name: 'create-entity', onClick: this.createEntity.bind(this), className: 'pull-right' }, "Create Entity")));
    }
};
CreateEntity = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateEntity);
exports.CreateEntity = CreateEntity;
;
//# sourceMappingURL=CreateEntity.js.map