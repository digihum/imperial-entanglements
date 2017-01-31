/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { Link } from 'react-router';

import { SameAsEditor } from '../fields/SameAsEditor';
import { AppUrls } from '../../ApiService';

import { Predicate, Serializer, Record } from '@digihum/falcon-core';

import { EditableHeader } from '../fields/EditableHeader';
import { EditableFieldHOC } from '../fields/EditableFieldComponent';
import { EditableParagraph } from '../fields/EditableParagraph';
import { PredicateDescription } from '../fields/PredicateDescription';
import { ComboDropdownOption } from '../ComboDropdown';

import { literalTypes } from '../../literalTypes';

import { ModalDefinition } from '../modal/ModalDefinition';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

const HeaderEditableFieldComponent = EditableFieldHOC(EditableHeader);
const ParagraphEditableFieldComponent = EditableFieldHOC(EditableParagraph);
const SameAsEditableFieldComponent = EditableFieldHOC(SameAsEditor);

interface PredicateEditorProps {
    id: number;
    dataStore?: DataController;
    modalStore?: ModalStore;
}

interface PredicateEditorState {
    records: Record[];
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
@inject('dataStore', 'modalStore')
@observer
export class PredicateEditorWorkspace extends React.Component<PredicateEditorProps, PredicateEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            records: []
        };
    }

    public updatePredicate(field: string, value: string | number | null, rangeIsReferenceOverride: boolean | null = null) {

        const predicate = this.props.dataStore!.dataStore.tabs.predicate[this.props.id].value;

        if (predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }

        const rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? predicate.rangeIsReference : rangeIsReferenceOverride;

        this.props.dataStore!.patchItem(Predicate, AppUrls.predicate, predicate.uid!,
        {
            [field]: value,
            rangeIsReference: rangeIsReferenceVal
        });
    }

    public copy() {

        const predicate = this.props.dataStore!.dataStore.tabs.predicate[this.props.id].value;

        const newPredicate = Serializer.fromJson(Predicate,
            Object.assign({}, Serializer.toJson(predicate), { label: 'Copy of ' + predicate.label}));

        this.props.dataStore!.postItem(Predicate, AppUrls.predicate, newPredicate, {})
            .then(([id]) => {
                this.props.dataStore!.createTab('predicate', id, 'item');
        });
    }

    public del() {
        this.props.dataStore!.delItem(Predicate, AppUrls.predicate, this.props.id)
        .then(() => this.context.router.transitionTo('/edit/notfound'))
        .catch((e) => {
           if (e.code === 404) {
              this.context.router.transitionTo('/edit/notfound');
           }

           if (e.code === 422) {

            e.data.then((data) => {

                const conflictResolutionModal : ModalDefinition = {
                    name: 'conflict_resolution',
                    cancel: () => {},
                    complete: (result) => {
                        if (result === 'addToWorkspace') {
                            data.forEach((datum) => {
                                 this.props.dataStore!.createTab('entity', datum.entity, 'item');
                            });
                        }

                        if (result === 'deleteAll') {
                            Promise.all(data.record.map((datum) => this.props.dataStore!.delItem(Record, AppUrls.record, datum.uid)))
                            .then(() => {
                                this.del();
                            });
                        }
                    },
                    settings: {
                        conflictingItems: data,
                        message: 'Deleting Predicate'
                    }
                };

                this.props.modalStore!.addModal(conflictResolutionModal);
            });
           }
        });
    }

    public render() {

        const predicate = this.props.dataStore!.dataStore.tabs.predicate[this.props.id].value;
        const entityTypes = this.props.dataStore!.dataStore.all.entity_type.value;

        const currentDomainEntityType = entityTypes.find((t) => t.uid == predicate.domain);

        let currentDomainEntityTypeName = '';

        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.label;
        }

        const domain : ComboDropdownOption<number> = {key: currentDomainEntityTypeName, value: predicate.domain };

        const range : ComboDropdownOption<{isReference: boolean, value: number | string}> = {key: '', value: {
          isReference: predicate.rangeIsReference,
          value: predicate.range
        }};

        if (predicate.rangeIsReference) {
            const currentRangeEntityType =
                entityTypes.find((t) => t.uid === predicate.range);

            if (currentRangeEntityType !== undefined) {
                range.key = currentRangeEntityType.label;
            }

        } else {
            const literalType = literalTypes.find((t) => t.value === predicate.range);
            if (literalType !== undefined) {
                range.key = literalType.label;
            }
        }

        const entityTypeOptions = entityTypes.map((t) => {
            if (t.uid === null) {
                throw new Error('Encountered entity type with no id!');
            }
            return { key: t.label, value: t.uid };
        });

        const literalTypeOptions : ComboDropdownOption<{isReference: boolean, value: number | string}>[] =
          literalTypes.map((t) => ({ key: t.label, value: { value: t.label, isReference: false }}));

        const entityTypeMap2 : ComboDropdownOption<{isReference: boolean, value: number | string}>[] =
          entityTypeOptions.map((e) => ({ key: e.key, value: { isReference: true, value: e.value!.toString()}}));

        return (
            <div className='workspace-editor'>
                <header className='editor-header predicate'>
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <i className='fa fa-long-arrow-right item-icon'></i>
                        <HeaderEditableFieldComponent
                            value={predicate.label}
                            onChange={(value) => this.updatePredicate('label', value)} />
                    </div>
                    <div className='sub-toolbar'>
                        <i
                            className='fa fa-trash delete button'
                            aria-hidden='true'
                            onClick={this.del.bind(this)}
                        ></i>
                        <i
                            className='fa fa-clone button'
                            aria-hidden='true'
                            onClick={this.copy.bind(this)}
                        ></i>
                    </div>
                  </div>
                  <div className='secondary-toolbar'>
                      <div className='tab-bar'>
                        <div className={'predicate selected'}>CORE</div>
                        <div style={{display:'none'}} className={'predicate'}>SAME AS</div>
                      </div>
                  </div>
                </header>

                <section className='editor-body'>

                    <div><Link to={`/edit/entity?col1p=${this.props.id}&col1f=exists`}>Uses: {predicate.uses}</Link></div>

                    <div className='edit-group'>
                        <label className='small'>Description</label>
                        <ParagraphEditableFieldComponent
                            value={predicate.description!}
                            onChange={(value) => this.updatePredicate('description', value)} />
                    </div>

                    <div className='edit-group'>
                        <label className='small'>Typing</label>
                        <PredicateDescription
                            domain={domain}
                            range={range}
                            domainChanged={(value) => this.updatePredicate('domain', value.value!)}
                            rangeChanged={(value) => this.updatePredicate('range', value.value!.value, value.value!.isReference)}
                            mode='editSingle'
                            domainOptions={entityTypeOptions}
                            rangeOptions={literalTypeOptions.concat(entityTypeMap2)}
                        />
                    </div>

                    <div>
                        <SameAsEditableFieldComponent
                            value={predicate.sameAs!}
                            onChange={(value) => this.updatePredicate('sameAs', value)} />
                    </div>
                </section>
            </div>
        );
    }
}
