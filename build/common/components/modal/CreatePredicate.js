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
const PredicateDescription_1 = require("../fields/PredicateDescription");
const falcon_core_1 = require("@digihum/falcon-core");
const literalTypes_1 = require("../../literalTypes");
const ApiService_1 = require("../../ApiService");
const mobx_react_1 = require("mobx-react");
let CreatePredicate = class CreatePredicate extends React.Component {
    constructor() {
        super();
        this.state = {
            label: '',
            domain: { key: '', value: null },
            range: { key: '', value: null },
            domainOptions: [],
            rangeOptions: []
        };
    }
    componentWillMount() {
        this.setState({ label: this.props.initialName });
    }
    componentDidMount() {
        if (this.props.initialDomain !== undefined) {
            this.props.dataStore.getItem(falcon_core_1.EntityType, ApiService_1.AppUrls.entity_type, this.props.initialDomain)
                .then((result) => {
                if (result.uid === null) {
                    throw new Error('Unexpected null uid');
                }
                this.setState({
                    domain: { key: result.label, value: result.uid },
                    domainOptions: [
                        { key: result.label, value: result.uid }
                    ].concat(result.parents.map((entityTypeId) => {
                        const parentEntityType = this.props.dataStore.dataStore.all.entity_type.value.find((e) => e.uid === entityTypeId);
                        return { key: parentEntityType.label, value: entityTypeId };
                    }))
                });
            });
        }
        const results = this.props.dataStore.dataStore.all.entity_type.value;
        const entityTypeMap = results.map((entityType) => {
            if (entityType.uid === null) {
                throw new Error('Unexpected null uid');
            }
            return { key: entityType.label, value: entityType.uid };
        });
        const entityTypeMap2 = entityTypeMap.map((e) => ({ key: e.key, value: { isReference: true, value: e.value.toString() } }));
        const literalTypesMap = literalTypes_1.literalTypes.map((lit) => ({ key: lit.label, value: { isReference: false, value: lit.value } }));
        if (this.props.initialDomain === undefined) {
            this.setState({ domainOptions: entityTypeMap });
        }
        this.setState({
            rangeOptions: literalTypesMap.concat(entityTypeMap2)
        });
    }
    create() {
        if (this.state.range.value === null || this.state.domain.value === null) {
            throw new Error('Domain and range must be set');
        }
        const newPredicate = falcon_core_1.Serializer.fromJson(falcon_core_1.Predicate, {
            label: this.state.label,
            domain: this.state.domain.value,
            range: this.state.range.value.value,
            rangeIsReference: this.state.range.value.isReference
        });
        this.props.dataStore.postItem(falcon_core_1.Predicate, ApiService_1.AppUrls.predicate, newPredicate, {})
            .then((result) => {
            newPredicate.uid = result[0];
            this.props.complete(newPredicate);
        });
    }
    render() {
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null,
                React.createElement("i", { className: 'fa fa-plus', "aria-hidden": 'true' }),
                " Create Property"),
            React.createElement("label", { className: 'small' }, "Name"),
            React.createElement("input", { type: 'text', className: 'gap', ref: (a) => {
                    if (a !== null) {
                        a.focus();
                    }
                }, value: this.state.label, onChange: (e) => this.setState({ label: e.target.value }) }),
            React.createElement(PredicateDescription_1.PredicateDescription, { domain: this.state.domain, range: this.state.range, domainChanged: (s) => this.setState({ domain: s }), rangeChanged: (s) => this.setState({ range: s }), domainOptions: this.state.domainOptions, rangeOptions: this.state.rangeOptions, mode: 'editAll' }),
            React.createElement("div", { className: 'modal-toolbar' },
                React.createElement("button", { onClick: this.props.cancel, className: 'pull-left' }, "Cancel"),
                React.createElement("button", { onClick: this.create.bind(this), className: 'pull-right' }, "Create Property"))));
    }
};
CreatePredicate = __decorate([
    mobx_react_1.inject('dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreatePredicate);
exports.CreatePredicate = CreatePredicate;
;
//# sourceMappingURL=CreatePredicate.js.map