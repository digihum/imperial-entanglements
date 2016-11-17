/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

import { Record, Source, Entity } from '../../../common/datamodel/datamodel';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ScorePicker } from '../fields/ScorePicker';
import { ComboDropdown } from '../ComboDropdown';
import { showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';
import { AppUrls } from '../../ApiService';
import { DataStore } from '../../DataStore';

import { StringFieldEditor } from './StringFieldEditor';
import { EntityFieldEditor } from './EntityFieldEditor';
import { DateFieldEditor } from './DateFieldEditor';
import { IntegerFieldEditor } from './IntegerFieldEditor';

import { AddTabButton } from '../AddTabButton';

import { formatDate } from '../../helper/formatDate';

interface RecordRowProps extends EditableSubfieldProps<Record> {
    dimension: string;
    sources: Source[];
    entities: Entity[];
    dataStore: DataStore;
}

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
    };

const recordEditor = (props: RecordRowProps) => {
    switch (props.value.valueType) {
        case 'string':
            return (<StringFieldEditor
                value={props.value.value || ''}
                onChange={(value) => props.onChange(Object.assign(props.value, { value }))} />);
        case 'date':
            return (<DateFieldEditor
                value={props.value.value || ''}
                onChange={(value) => props.onChange(Object.assign(props.value, { value }))} />);
        case 'integer':
            return (<IntegerFieldEditor
                value={props.value.value || ''}
                onChange={(value) => props.onChange(Object.assign(props.value, { value }))} />);
        case 'entity':
            return (<EntityFieldEditor
                value={props.value.value || ''}
                onChange={(value) => props.onChange(Object.assign(props.value, { value }))}
                entities={props.entities} />);
        default:
            return (<div>Missing editor</div>);
    }
};

const formatValue = (props: RecordRowProps) => {
    if (props.value.valueType === 'entity') {
        const entity = props.entities.find((entity) => entity.uid == props.value.value);
        if (entity !== undefined) {
            return (<span>
                {entity.label} <AddTabButton
                    uid={entity.uid}
                    tabType='entity' />
            </span>);
        } else {
            return (<em>Missing Entity</em>);
        }
    }

    if (props.value.valueType === 'date') {
       return formatDate(props.value.value);
    }

    return props.value.value;
};

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
        <tr className='record-row'>
            <td className='record-row-item uid'>{props.value.uid}</td>
            {recordValue.valueType !== 'source' ? (
                <td className='record-row-item'>
                    {recordEditor(props)}
                </td>
            ) : null}
            <td className='record-row-item'>
                <ComboDropdown
                    options={props.sources.map((source) => ({ key: source.name , value: source.uid}))}
                    typeName='source'
                    value={dropDownValue}
                    setValue={(combo) => props.onChange(Object.assign(props.value, { source: combo.value }))}
                    createNewValue={createNewSource}
                />
            </td>
            <td className='record-row-item score'>
                <ScorePicker value={props.value.score} readOnly={false}
                    onChange={(score) => props.onChange(Object.assign(props.value, { score }))} />
            </td>
            <td className='record-row-item period'>
                <DateFieldEditor
                    value={props.value.period || ''}
                    onChange={(period) => props.onChange(Object.assign(props.value, { period }))} />
            </td>
            <td className='record-row-item buttons'>
                <button><i className='fa fa-check' onClick={props.acceptChanges} aria-hidden='true'></i></button>
                <button><i className='fa fa-times' aria-hidden='true' onClick={props.cancelChanges}></i></button>
            </td>
        </tr>);
    } else {
        return (
        <tr className='record-row'>
            <td className='record-row-item uid'>#{props.value.uid}</td>
            {recordValue.valueType !== 'source' ? (
                <td className='record-row-item'>
                   {formatValue(props)}
                </td>
            ) : null }
            <td className='record-row-item'>{dropDownValue.key}
                {dropDownValue.key.length > 0 ? (
                    <AddTabButton 
                        dataStore={props.dataStore}
                        uid={dropDownValue.value}
                        tabType='source' />
                ) : null}
			</td>
            <td className='record-row-item score'>
                 <ScorePicker value={props.value.score} readOnly={true} />
            </td>
            <td className='record-row-item period'>
                 {formatDate(props.value.period)}
            </td>
            <td className='record-row-item buttons'>
                <button><i className='fa fa-pencil-square-o' title='Edit' onClick={props.setEdit} aria-hidden='true'></i></button>
                <button><i className='fa fa-trash' aria-hidden='true' onClick={props.onDelete}></i></button>
            </td>
        </tr>
        );
    }
}; 