/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Record, Serializer, Source } from '@digihum/falcon-core';
import { AppUrls } from '../../ApiService';

import { DataController } from '../../stores/DataController';
import { inject, observer } from 'mobx-react';

import { ModalStore } from '../../stores/ModalStore';

import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { ModalDefinition } from './ModalDefinition';



interface CreatePresetRecordProps {
    complete: (s: any) => void;
    cancel: () => void;
    source: Source;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface CreatePresetRecordState {
}

@inject('dataStore', 'modalStore')
@observer
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

                const isMentioned = this.props.dataStore!.dataStore.all.predicate.value.find((pred) => pred.label === 'is mentioned');

                if (isMentioned === undefined) {
                  throw new Error('Is mentioned predicate is missing, it should be loaded by default');
                }

                this.props.dataStore!.postItem(Record, AppUrls.record,
                    Serializer.fromJson(Record, {
                        predicate: isMentioned.uid,
                        entity: data[0],
                        valueType: 'source',
                        source: this.props.source.uid,
                        score: 3
                    }), {})
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
