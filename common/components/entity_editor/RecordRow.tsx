/**
 * @fileOverview Various tool functions.
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';
import { Record } from '../../../common/datamodel/datamodel';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ScorePicker } from '../fields/ScorePicker';

interface RecordRowProps extends EditableSubfieldProps<Record> {
    dimension: string;
}

export const RecordRow = (props: RecordRowProps) => {

    if (props.value === null) {
        throw new Error('Should not be null!!');
    }

    if (props.edit) {
        return (
        <div className='record-row'>
            <div className='record-row-item uid'>#{props.value.uid}</div>
            <div className='record-row-item'>{props.value.value}</div>
            <div className='record-row-item'>{props.value.source}</div>
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
            <div className='record-row-item'>{props.value.source}</div>
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