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


interface CreateRecordProps {
    api: ApiService;
    options: { key: string, value: string, meta: Predicate}[];
    complete: (s: string) => void;
    cancel: () => void;
    entityUid: number;
}

interface CreateRecordState {
    comboValue: ComboDropdownOption;
}

export class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    constructor() {
        super();
        this.state = {
            comboValue: {key: '', value: ''}
        };
    }

    public setComboValue(opt: { key: string, value: string, meta: Predicate }) {
        this.props.api.postItem(Record, AppUrls.record,
            new Record().deserialize({
                predicate: opt.meta.uid,
                entity: this.props.entityUid,
                valueType: opt.meta.rangeIsReference ? 'entity' : opt.meta.range
            }))
        .then(this.props.cancel)
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
                createNewValue={this.props.complete}
            />
        </Overlay>
        );
    }
};