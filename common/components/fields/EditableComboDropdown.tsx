/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Record, Source } from '../../../common/datamodel/datamodel';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ScorePicker } from '../fields/ScorePicker';
import { ComboDropdown, ComboDropdownOption, ComboDropdownProps } from '../ComboDropdown';
import { createTab, showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';
import { AppUrls } from '../../ApiService';

import { AddTabButton } from '../AddTabButton';

import { omit } from 'lodash';

interface EditableComboDropdownProps extends EditableSubfieldProps<string> {
    comboSettings: ComboDropdownProps;
}

export const EditableComboDropdown = (props: RecordRowProps) => {

    const createNewSource = (initialValue: string) => {
        const a : ModalDefinition = {
            name: 'source',
            complete: () => {
                // TODO : Automatically reload sources
            },
            cancel: () => { console.log('cancel')},
            settings: {
                initialValue
            }
        };

        showModal.dispatch(a);
    }

    const recordValue = props.value;

    if (recordValue === null) {
        throw new Error('Should not be null!!');
    }

    const currentSource = props.sources.find((source) => source.uid === recordValue.source);
    const dropDownValue = {
        key: '', value: props.value.source
    };

    if (currentSource !== undefined) {
        dropDownValue.key = currentSource.name;
    }

    if (props.edit) {
        return (<div>
            <ComboDropdown {...props.comboSettings} />
            <button><i className='fa fa-check' onClick={props.acceptChanges} aria-hidden='true'></i></button>
            <button><i className='fa fa-times' aria-hidden='true' onClick={props.cancelChanges}></i></button>
        </div>
        );
    } else {
        return (
            <div>
                <p>
                    {props.value === null || props.value.length > 0 ? props.value
                    : (
                        <em>No value</em>
                    )}
                    <sup>
                        <i className='fa fa-pencil-square-o'
                            aria-hidden='true'
                            onClick={props.setEdit}>
                        </i>
                    </sup>
                </p>
            </div>
        );
    }
}; 