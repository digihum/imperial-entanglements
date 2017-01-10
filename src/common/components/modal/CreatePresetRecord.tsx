/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Record, Serializer, Source } from 'falcon-core';
import { ApiService, AppUrls } from '../../ApiService';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { ModalDefinition } from './ModalDefinition';

interface CreatePresetRecordProps {
    api: ApiService;
    complete: (s: any) => void;
    cancel: () => void;
    source: Source;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface CreatePresetRecordState {
}

export class CreatePresetRecord extends React.Component<CreatePresetRecordProps, CreatePresetRecordState> {

    private static openEntityDialog : boolean = true;

    constructor() {
        super();
        this.state = {
          };
    }

    public componentDidMount() {
        if (CreatePresetRecord.openEntityDialog) {
            CreatePresetRecord.openEntityDialog = false;
            this.createNewEntity();
        } else {
            CreatePresetRecord.openEntityDialog = true;
        }
    }

    public createNewEntity() {
        const modalDef: ModalDefinition = {
            name: 'entity',
            complete: (data : number[]) => {

                const isMentioned = this.props.dataStore.all.predicate.value.find((pred) => pred.label === 'is mentioned');

                this.props.api.postItem(Record, AppUrls.record,
                    Serializer.fromJson(Record, {
                        predicate: isMentioned.uid,
                        entity: data[0],
                        valueType: 'source',
                        source: this.props.source.uid,
                        score: 3
                    }))
                .then((result) => {
                    this.props.complete(result);
                })
                .catch(this.props.cancel);
            },
            cancel: () => {
            },
            settings: {}
        };

        this.props.modalStore!.addModal(modalDef);
    }

    public render() {
        return null;
    }
};
