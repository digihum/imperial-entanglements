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
const mobx_react_1 = require("mobx-react");
class PredicateComboDropdown extends ComboDropdown_1.ComboDropdown {
}
let CreateRecord = class CreateRecord extends React.Component {
    constructor() {
        super();
        this.state = {
            comboValue: { key: '', value: null },
            searchValue: ''
        };
    }
    componentDidMount() {
        this.refs['comboDropDown'].refs['comboDropDownInputBox'].focus();
    }
    createNewPredicate() {
        const modalDef = {
            name: 'predicate',
            complete: (data) => {
                console.log('Predicate editor called complete');
                this.setComboValue({ key: data.label, value: data === null ? null : data });
            },
            cancel: () => {
                console.log('Predicate editor called cancel');
            },
            settings: {
                initialName: this.state.searchValue,
                initialDomain: this.props.entityType
            }
        };
        this.props.modalStore.addModal(modalDef);
    }
    setComboValue(opt) {
        if (opt.value === null) {
            throw new Error('Value cannot be null');
        }
        this.props.dataStore.postItem(falcon_core_1.Record, ApiService_1.AppUrls.record, falcon_core_1.Serializer.fromJson(falcon_core_1.Record, {
            predicate: opt.value.uid,
            entity: this.props.entityUid,
            valueType: opt.value.rangeIsReference ? 'entity' : opt.value.range,
            score: 3,
            source: this.props.dataStore.defaultSource
        }), {})
            .then((result) => this.props.complete(result))
            .catch(this.props.cancel);
    }
    render() {
        return (React.createElement(Overlay_1.Overlay, null,
            React.createElement("h2", null, "Create Record"),
            React.createElement(PredicateComboDropdown, { ref: 'comboDropDown', options: this.props.options, typeName: 'predicate', value: this.state.comboValue, setValue: this.setComboValue.bind(this), createNewValue: this.createNewPredicate.bind(this), updateSearchString: (s) => this.setState({ searchValue: s }) })));
    }
};
CreateRecord = __decorate([
    mobx_react_1.inject('modalStore', 'dataStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [])
], CreateRecord);
exports.CreateRecord = CreateRecord;
;
//# sourceMappingURL=CreateRecord.js.map