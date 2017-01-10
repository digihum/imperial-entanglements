/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Record, Predicate, Serializer } from 'falcon-core';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { ModalDefinition } from './ModalDefinition';

import { inject, observer } from 'mobx-react';

import { ModalStore } from '../../stores/ModalStore';

interface CreateRecordProps {
    api: ApiService;
    options: { key: string, value: string, meta: Predicate}[];
    complete: (s: any) => void;
    cancel: () => void;
    entityUid: number;
    entityType: number;
    modalStore?: ModalStore;
}

interface CreateRecordState {
    comboValue: ComboDropdownOption;
    searchValue: string;
}

@inject('modalStore')
@observer
export class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    constructor() {
        super();
        this.state = {
            comboValue: {key: '', value: ''},
            searchValue: ''
        };
    }

    public componentDidMount() {
        ((this.refs['comboDropDown'] as React.Component<any, any>).refs['comboDropDownInputBox'] as HTMLElement).focus();
    }

    public createNewPredicate() {
        const modalDef: ModalDefinition = {
            name: 'predicate',
            complete: (data : Predicate) => {
                console.log('Predicate editor called complete');
                this.setComboValue({ key: data.label, value: data.uid === null ? null : data.uid.toString(), meta: data});
            },
            cancel: () => {
                console.log('Predicate editor called cancel');
            },
            settings: {
                initialName: this.state.searchValue,
                initialDomain: this.props.entityType
            }
        };

        this.props.modalStore!.addModal(modalDef);
    }

    public setComboValue(opt: { key: string, value: string | null, meta: Predicate }) {
        this.props.api.postItem(Record, AppUrls.record,
            Serializer.fromJson(Record, {
                predicate: opt.meta.uid,
                entity: this.props.entityUid,
                valueType: opt.meta.rangeIsReference ? 'entity' : opt.meta.range,
                score: 3
            }))
        .then((result) => this.props.complete(result))
        .catch(this.props.cancel);
    }

    public render() {
        return (
        <Overlay>
            <h2>Create Record</h2>
            <ComboDropdown
                ref='comboDropDown'
                options={this.props.options}
                typeName='predicate'
                value={this.state.comboValue}
                setValue={this.setComboValue.bind(this)}
                createNewValue={this.createNewPredicate.bind(this)}
                updateSearchString={(s) => this.setState({ searchValue: s})}
            />
        </Overlay>
        );
    }
};
