/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Record, Source } from '../../../common/datamodel/datamodel';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ScorePicker } from '../fields/ScorePicker';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { createTab } from '../../Signaller';
import { AppUrls } from '../../ApiService';

import { StringFieldEditor } from './StringFieldEditor';

interface RecordRowProps extends EditableSubfieldProps<Record> {
    dimension: string;
    sources: Source[];
}

export const RecordRow = (props: RecordRowProps) => {

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
        return (
        <div className='record-row'>
            <div className='record-row-item uid'>#{props.value.uid}</div>
            <div className='record-row-item'>
                {(() => {
                    switch(props.value.valueType) {
                        case 'string':
                            return (<StringFieldEditor
                                value={props.value.value || ''}
                                onChange={(value) => props.onChange(Object.assign(props.value, { value }))} />);
                        default:
                            return (<div>Missing editor</div>);
                    }
                })()}
            </div>
            <div className='record-row-item'>
                <ComboDropdown
                    options={props.sources.map((source) => ({ key: source.name , value: source.uid}))}
                    typeName='source'
                    value={dropDownValue}
                    setValue={(combo) => props.onChange(Object.assign(props.value, { source: combo.value }))}
                    createNewValue={(s) => console.log(s)}
                />
            </div>
            <div className='record-row-item score'>
                <ScorePicker value={3} onChange={(val) => console.log(val)} />
            </div>
            <div className='record-row-item buttons'>
                <button><i className='fa fa-check' onClick={props.acceptChanges} aria-hidden='true'></i></button>
                <button><i className='fa fa-times' aria-hidden='true' onClick={props.cancelChanges}></i></button>
            </div>
        </div>);
    } else {
        return (
        <div className='record-row'>
            <div className='record-row-item uid'>#{props.value.uid}</div>
            <div className='record-row-item'>{props.value.value}</div>
            <div className='record-row-item'>{dropDownValue.key}
                {dropDownValue.key.length > 0 ? (
                    <i className='icon-list-add add-button'
                    onClick={() => createTab.dispatch(dropDownValue.key, 
                            dropDownValue.value,
                                `/${AppUrls.source}/${dropDownValue.value}`)}></i>
                ) : null}
			</div>
            <div className='record-row-item score'>
                <i className='fa fa-star-o' aria-hidden='true'></i>
                <i className='fa fa-star-o' aria-hidden='true'></i>
                <i className='fa fa-star-o' aria-hidden='true'></i>
                <i className='fa fa-star-o' aria-hidden='true'></i>
                <i className='fa fa-star-o' aria-hidden='true'></i>
            </div>
            <div className='record-row-item buttons'>
                <button><i className='fa fa-pencil-square-o' onClick={props.setEdit} aria-hidden='true'></i></button>
                <button><i className='fa fa-trash' aria-hidden='true' onClick={props.onDelete}></i></button>
            </div>
        </div>
        );
    }
}; 