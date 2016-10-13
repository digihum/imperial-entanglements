/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

import { Overlay } from '../Overlay';
import { Record } from '../../../common/datamodel/datamodel';
import { ApiService, AppUrls } from '../../ApiService';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';


interface CreateRecordProps {
    api: ApiService;
    options: ComboDropdownOption[];
    create: (s: string) => void;
    close: () => void;
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

    public setComboValue(opt: ComboDropdownOption) {
        this.props.api.postItem(Record, AppUrls.record,
            new Record().deserialize({
                predicate: opt.value,
                entity: this.props.entityUid
            }))
        .then(this.props.close)
        .catch(this.props.close);
    }

    public render() {
        return (
        <Overlay>
            <ComboDropdown
                options={this.props.options}
                typeName='predicate'
                value={this.state.comboValue}
                setValue={this.setComboValue.bind(this)}
                createNewValue={this.props.create}
            />
        </Overlay>
        );
    }
};