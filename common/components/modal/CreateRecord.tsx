/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Record, Predicate } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';

import { showModal, createTab } from '../../Signaller';
import { ModalDefinition } from './ModalDefinition';

import { noop } from 'lodash';

interface CreateRecordProps {
    api: ApiService;
    options: { key: string, value: string, meta: Predicate}[];
    complete: (s: any) => void;
    cancel: () => void;
    entityUid: number;
}

interface CreateRecordState {
    comboValue: ComboDropdownOption;
    searchValue: string;
}

export class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    constructor() {
        super();
        this.state = {
            comboValue: {key: '', value: ''},
            searchValue: ''
        };
    }

    public createNewPredicate() {
        const modalDef: ModalDefinition = {
            name: 'predicate',
            complete: (data : Predicate) => {
                console.log('Predicate editor called complete');
                this.setComboValue({ key: data.name, value: data.uid.toString(), meta: data});
                createTab.dispatch(data.name, `Predicate ${data.uid}`, `/${AppUrls.predicate}/${data.uid}`);
            },
            cancel: () => {
                console.log('Predicate editor called cancel');
            },
            settings: {
                initialName: this.state.searchValue,
                initialDomain: 2
            }
        };

        showModal.dispatch(modalDef);
    }

    public setComboValue(opt: { key: string, value: string, meta: Predicate }) {
        this.props.api.postItem(Record, AppUrls.record,
            new Record().deserialize({
                predicate: opt.meta.uid,
                entity: this.props.entityUid,
                valueType: opt.meta.rangeIsReference ? 'entity' : opt.meta.range
            }))
        .then((result) => this.props.complete(result))
        .catch(this.props.cancel);
    }

    public render() {
        return (
        <Overlay>
            <ComboDropdown
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