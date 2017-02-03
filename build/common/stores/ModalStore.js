/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
const React = require("react");
const lodash_1 = require("lodash");
const CreatePredicate_1 = require("../components/modal/CreatePredicate");
const CreateRecord_1 = require("../components/modal/CreateRecord");
const CreatePresetRecord_1 = require("../components/modal/CreatePresetRecord");
const CreateSource_1 = require("../components/modal/CreateSource");
const CreateEntity_1 = require("../components/modal/CreateEntity");
const CreateEntityType_1 = require("../components/modal/CreateEntityType");
const ConflictResolution_1 = require("../components/modal/ConflictResolution");
const CreateTabSet_1 = require("../components/modal/CreateTabSet");
const mobx_1 = require("mobx");
class ModalStore {
    constructor() {
        this.modalQueue = [];
    }
    // might be @computed?
    get currentModal() {
        if (this.modalQueue.length === 0) {
            return null;
        }
        const sharedProps = {
            complete: this.modalComplete.bind(this),
            cancel: this.modalCancel.bind(this)
        };
        switch (this.modalQueue[0].name) {
            case 'predicate':
                return (React.createElement(CreatePredicate_1.CreatePredicate, __assign({}, sharedProps, { initialName: this.modalQueue[0].settings['initialName'], initialDomain: this.modalQueue[0].settings['initialDomain'] })));
            case 'record':
                return (React.createElement(CreateRecord_1.CreateRecord, __assign({}, sharedProps, { entityType: this.modalQueue[0].settings['entityType'], entityUid: this.modalQueue[0].settings['entityUid'], options: this.modalQueue[0].settings['options'] })));
            case 'preset_record':
                return (React.createElement(CreatePresetRecord_1.CreatePresetRecord, __assign({}, sharedProps, { source: this.modalQueue[0].settings['source'] })));
            case 'source':
                return (React.createElement(CreateSource_1.CreateSource, __assign({}, sharedProps, { initialValue: this.modalQueue[0].settings['initialName'] })));
            case 'entity':
                return (React.createElement(CreateEntity_1.CreateEntity, __assign({}, sharedProps, this.modalQueue[0].settings)));
            case 'entity_type':
                return (React.createElement(CreateEntityType_1.CreateEntityType, __assign({}, sharedProps, this.modalQueue[0].settings)));
            case 'conflict_resolution':
                return (React.createElement(ConflictResolution_1.ConflictResolution, __assign({}, sharedProps, { conflictingItems: this.modalQueue[0].settings['conflictingItems'], message: this.modalQueue[0].settings['message'] })));
            case 'createTabSet':
                return (React.createElement(CreateTabSet_1.CreateTabSet, __assign({}, sharedProps)));
        }
        return null;
    }
    addModal(def) {
        this.modalQueue.unshift(def);
    }
    modalComplete(data) {
        if (this.modalQueue.length === 0) {
            throw new Error('Attempted to complete non-existent modal');
        }
        this.modalQueue[0].complete(data);
        if (this.modalQueue.length > 0) {
            this.modalQueue = lodash_1.tail(this.modalQueue);
        }
    }
    modalCancel() {
        if (this.modalQueue.length === 0) {
            throw new Error('Attempted to cancel non-existent modal');
        }
        this.modalQueue[0].cancel();
        this.modalQueue = [];
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], ModalStore.prototype, "modalQueue", void 0);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ModalStore.prototype, "currentModal", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "addModal", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "modalComplete", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalStore.prototype, "modalCancel", null);
exports.ModalStore = ModalStore;
//# sourceMappingURL=ModalStore.js.map