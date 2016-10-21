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
import { ComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { createTab, showModal } from '../../Signaller';
import { ModalDefinition } from '../modal/ModalDefinition';
import { AppUrls } from '../../ApiService';

import { StringFieldEditor } from './StringFieldEditor';
import { EntityFieldEditor } from './EntityFieldEditor';
import { DateFieldEditor } from './DateFieldEditor';
import { AddTabButton } from '../AddTabButton';

interface RecordRowProps extends EditableSubfieldProps<Record> {
    dimension: string;
    sources: Source[];
    entities: Entity[];
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
                        case 'date':
                            return (<DateFieldEditor
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
                })()}
            </div>
            <div className='record-row-item'>
                <ComboDropdown
                    options={props.sources.map((source) => ({ key: source.name , value: source.uid}))}
                    typeName='source'
                    value={dropDownValue}
                    setValue={(combo) => props.onChange(Object.assign(props.value, { source: combo.value }))}
                    createNewValue={createNewSource}
                />
            </div>
            <div className='record-row-item score'>
                <ScorePicker value={props.value.score} readOnly={false}
                    onChange={(score) => props.onChange(Object.assign(props.value, { score }))} />
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
            <div className='record-row-item'>
                 {(() => {
                     if (props.value.valueType === 'entity') {
                         const entity = props.entities.find((entity) => entity.uid == props.value.value);
                         if (entity !== undefined) {
                             return (<span>
                                {entity.label} <AddTabButton title={entity.label}
                                    subtitle={`Entity ${entity.uid}`}
                                    url={`/${AppUrls.entity}/${entity.uid}`}
                                    tabType='entity' />
                            </span>);
                         } else {
                             return (<em>Missing Entity</em>);
                         }
                     }
                    return props.value.value;
                })()}
            </div>
            <div className='record-row-item'>{dropDownValue.key}
                {dropDownValue.key.length > 0 ? (
                    <AddTabButton title={dropDownValue.key}
                        subtitle={`Source ${dropDownValue.value}`}
                        url={`/${AppUrls.source}/${dropDownValue.value}`}
                        tabType='source' />
                ) : null}
			</div>
            <div className='record-row-item score'>
                 <ScorePicker value={props.value.score} readOnly={true} />
            </div>
            <div className='record-row-item buttons'>
                <button><i className='fa fa-pencil-square-o' onClick={props.setEdit} aria-hidden='true'></i></button>
                <button><i className='fa fa-trash' aria-hidden='true' onClick={props.onDelete}></i></button>
            </div>
        </div>
        );
    }
}; 