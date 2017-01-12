/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ModalDefinition } from '../components/modal/ModalDefinition';
import { tail } from 'lodash';

import { CreatePredicate } from '../components/modal/CreatePredicate';
import { CreateRecord } from '../components/modal/CreateRecord';
import { CreatePresetRecord } from '../components/modal/CreatePresetRecord';
import { CreateSource } from '../components/modal/CreateSource';
import { CreateEntity } from '../components/modal/CreateEntity';
import { CreateEntityType } from '../components/modal/CreateEntityType';
import { ConflictResolution } from '../components/modal/ConflictResolution';
import { CreateTabSet } from '../components/modal/CreateTabSet';

import { observable, action, computed } from 'mobx';

export class ModalStore {

  @observable private  modalQueue: ModalDefinition[];

  public constructor() {
    this.modalQueue = [];
  }

  // might be @computed?
  @computed public get currentModal() : JSX.Element | null {
    if (this.modalQueue.length === 0) {
        return null;
    }

    const sharedProps = {
        complete: this.modalComplete.bind(this),
        cancel: this.modalCancel.bind(this)
    };

    switch (this.modalQueue[0].name) {
        case 'predicate':
            return (<CreatePredicate {...sharedProps} {...this.modalQueue[0].settings} />);

        case 'record':
            return (<CreateRecord {...sharedProps} {...this.modalQueue[0].settings}/>);

        case 'preset_record':
            return (<CreatePresetRecord {...sharedProps} {...this.modalQueue[0].settings}/>);

        case 'source':
            return (<CreateSource {...sharedProps} {...this.modalQueue[0].settings}/>);

        case 'entity':
            return (<CreateEntity {...sharedProps} {...this.modalQueue[0].settings}/>);

        case 'entity_type':
            return (<CreateEntityType {...sharedProps} {...this.modalQueue[0].settings}/>);

        case 'conflict_resolution':
            return (<ConflictResolution {...sharedProps} {...this.modalQueue[0].settings} />);

        case 'createTabSet':
            return (<CreateTabSet {...sharedProps} {...this.modalQueue[0].settings} />);
    }

    return null;
  }

  @action public addModal(def: ModalDefinition) {
    this.modalQueue.unshift(def);
  }

  @action public modalComplete(data: any) {
    if (this.modalQueue.length === 0) {
        throw new Error('Attempted to complete non-existent modal');
    }
    this.modalQueue[0].complete(data);
    if (this.modalQueue.length > 0) {
        this.modalQueue = tail(this.modalQueue);
    }
  }

  @action public modalCancel() {
    if (this.modalQueue.length === 0) {
        throw new Error('Attempted to cancel non-existent modal');
    }
    this.modalQueue[0].cancel();
    this.modalQueue = [];
  }
}
