/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { Record, Source, Entity } from 'falcon-core';
import { EditableSubfieldProps } from '../fields/EditableFieldComponent';
export { EditableFieldComponent } from '../fields/EditableFieldComponent';
import { ScorePicker } from '../fields/ScorePicker';
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { ModalDefinition } from '../modal/ModalDefinition';

import { StringFieldEditor } from './StringFieldEditor';
import { EntityFieldEditor } from './EntityFieldEditor';
import { DateFieldEditor } from './DateFieldEditor';
import { IntegerFieldEditor } from './IntegerFieldEditor';

import { AddTabButton } from '../AddTabButton';

import { formatDate } from '../../helper/formatDate';

import { toString } from 'lodash';

import { inject } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

interface RecordRowProps extends EditableSubfieldProps<Record> {
    dimension: string;
    sources: Source[];
    entities: Entity[];
    dataStore?: DataController;
    modelStore?: ModalStore;
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

        this.props.modalStore!.addModal(a);
    };

const recordEditor = (props: RecordRowProps, record: Record) => {
    switch (record.valueType) {
        case 'string':
            return (<StringFieldEditor
                value={record.value || ''}
                onChange={(value) => props.onChange(Object.assign(record, { value }))} />);
        case 'date':
            return (<DateFieldEditor
                value={record.value || ''}
                onChange={(value) => props.onChange(Object.assign(record, { value }))} />);
        case 'integer':
            return (<IntegerFieldEditor
                value={record.value || ''}
                onChange={(value) => props.onChange(Object.assign(record, { value }))} />);
        case 'entity':
            return (<EntityFieldEditor
                value={record.value === null ? 0 : parseInt(record.value)}
                onChange={(value) => props.onChange(Object.assign(record, { value }))}
                entities={props.entities} />);
        default:
            return (<div>Missing editor</div>);
    }
};

const formatValue = (props: RecordRowProps, record: Record) => {
    if (record.valueType === 'entity') {
        const entity = props.entities.find((entity) => entity.uid == record.value);
        if (entity !== undefined) {
            if (entity.uid === null) {
              throw Error('Unexpected null ID on entity');
            }
            return (<span>
                {entity.label} <AddTabButton
                    uid={entity.uid}
                    tabType='entity' />
            </span>);
        } else {
            return (<em>Missing Entity</em>);
        }
    }

    if (record.valueType === 'date') {
       return (<span>{formatDate(record.value)}</span>);
    }

    return (<span>{record.value}</span>);
};

export const RecordRow = (props: RecordRowProps) => {

    const recordValue = props.value;

    if (recordValue === null) {
        throw new Error('Should not be null!!');
    }

    const currentSource = props.sources.find((source) => source.uid === recordValue.source);
    const dropDownValue : ComboDropdownOption = {
        key: '', value: recordValue.source === null ? null : toString(recordValue.source)
    };

    if (currentSource !== undefined) {
        dropDownValue.key = currentSource.label;
    }

    if (props.edit) {
        return (
        <tr className='record-row'>
            <td className='record-row-item uid'>{recordValue.uid}</td>
            {recordValue.valueType !== 'source' ? (
                <td className='record-row-item'>
                    {recordEditor(props, recordValue)}
                </td>
            ) : null}
            <td className='record-row-item'>
                <ComboDropdown
                    options={props.sources.map((source) =>
                      ({ key: source.label, value: source.uid !== null ? toString(source.uid) : null}))}
                    typeName='source'
                    value={dropDownValue}
                    setValue={(combo) => props.onChange(Object.assign(recordValue, { source: combo === null ? combo : combo.value }))}
                    createNewValue={createNewSource}
                />
            </td>
            <td className='record-row-item score'>
                <ScorePicker value={recordValue.score} readOnly={false}
                    onChange={(score) => props.onChange(Object.assign(recordValue, { score }))} />
            </td>
            <td className='record-row-item period'>
                <DateFieldEditor
                    value={recordValue.period || ''}
                    onChange={(period) => props.onChange(Object.assign(recordValue, { period }))} />
            </td>
            <td className='record-row-item buttons'>
                <button><i className='fa fa-check' onClick={props.acceptChanges} aria-hidden='true'></i></button>
                <button><i className='fa fa-times' aria-hidden='true' onClick={props.cancelChanges}></i></button>
            </td>
        </tr>);
    } else {
        return (
        <tr className='record-row'>
            <td className='record-row-item uid'>#{recordValue.uid}</td>
            {recordValue.valueType !== 'source' ? (
                <td className='record-row-item'>
                   {formatValue(props, recordValue)}
                </td>
            ) : null }
            <td className='record-row-item'>{dropDownValue.key}
                {dropDownValue.key.length > 0 && dropDownValue.value !== null ? (
                    <AddTabButton
                        uid={parseInt(dropDownValue.value)}
                        tabType='source' />
                ) : null}
			</td>
            <td className='record-row-item score'>
                 <ScorePicker value={recordValue.score} readOnly={true} />
            </td>
            <td className='record-row-item period'>
                 {formatDate(recordValue.period)}
            </td>
            <td className='record-row-item buttons'>
                <button><i className='fa fa-pencil-square-o' title='Edit' onClick={props.setEdit} aria-hidden='true'></i></button>
                <button><i className='fa fa-trash' aria-hidden='true' onClick={props.onDelete}></i></button>
            </td>
        </tr>
        );
    }
};
