/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';
import { Link } from 'react-router';

import { SameAsEditor } from '../fields/SameAsEditor';
import { AppUrls } from '../../ApiService';

import { Predicate, Serializer, Record } from 'falcon-core';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { PredicateDescription } from '../fields/PredicateDescription';
import { ComboDropdownOption } from '../ComboDropdown';

import { literalTypes } from '../../literalTypes';

import { ModalDefinition } from '../modal/ModalDefinition';

import { inject, observer } from 'mobx-react';

import { DataController } from '../../stores/DataController';
import { ModalStore } from '../../stores/ModalStore';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

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

    public updatePredicate(field: string, value: string, rangeIsReferenceOverride: boolean | null = null) {

        const predicate = this.props.dataStore!.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;

        if (predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }

        const rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? predicate.rangeIsReference : rangeIsReferenceOverride;

        this.props.dataStore!.patchItem(Predicate, AppUrls.predicate, predicate.uid,
        {
            [field]: value,
            rangeIsReference: rangeIsReferenceVal
        });
    }

    public copy() {

        const predicate = this.props.dataStore!.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;

        const newPredicate = Serializer.fromJson(Predicate,
            Object.assign({}, Serializer.toJson(predicate), { name: 'Copy of ' + predicate.label}));

        this.props.dataStore!.postItem(Predicate, AppUrls.predicate, newPredicate)
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

        const predicate = this.props.dataStore!.dataStore.tabs.predicate.get('predicate-' + this.props.id).value;
        const entityTypes = this.props.dataStore!.dataStore.all.entity_type.value;

        const currentDomainEntityType = entityTypes.find((t) => t.uid == predicate.domain);

        let currentDomainEntityTypeName = '';

        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.label;
        }

        const domain : ComboDropdownOption = {key: currentDomainEntityTypeName, value: predicate.domain.toString()};

        const range : ComboDropdownOption = {key: '', value: predicate.range.toString()};

        if (predicate.rangeIsReference) {
            const currentRangeEntityType =
                entityTypes.find((t) => t.uid == predicate.range);

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
            return { key: t.label, value: t.uid.toString() };
        });

        const literalTypeOptions = literalTypes.map((t) => ({ key: t.label, value: t.value, meta: 'literal'}));

        return (
            <div className='workspace-editor'>
                <header className='editor-header predicate'>
                  <div className='primary-toolbar'>
                    <div className='main-toolbar'>
                        <i className='fa fa-long-arrow-right item-icon'></i>
                        <StringEditableFieldComponent
                            value={predicate.label}
                            component={EditableHeader}
                            onChange={(value) => this.updatePredicate('label', value)}  />
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
                        <div className={'predicate'}>SAME AS</div>
                      </div>
                  </div>
                </header>

                <section className='editor-body'>

                    <div><Link to={`/edit/entity?col1p=${this.props.id}&col1f=exists`}>Uses: {predicate.uses}</Link></div>

                    <div className='edit-group'>
                        <label className='small'>Description</label>
                        <StringEditableFieldComponent
                            value={predicate.description}
                            component={EditableParagraph}
                            onChange={(value) => this.updatePredicate('description', value)}  />
                    </div>

                    <div className='edit-group'>
                        <label className='small'>Typing</label>
                        <PredicateDescription
                            domain={domain}
                            range={range}
                            domainChanged={(value) => this.updatePredicate('domain', value.value)}
                            rangeChanged={(value) => this.updatePredicate('range', value.value, value.meta !== 'literal')}
                            mode='editSingle'
                            domainOptions={entityTypeOptions}
                            rangeOptions={literalTypeOptions.concat(entityTypeOptions)}
                        />
                    </div>

                    <div>
                        <StringEditableFieldComponent
                            value={predicate.sameAs}
                            component={SameAsEditor}
                            onChange={(value) => this.updatePredicate('sameAs', value)} />
                    </div>
                </section>
            </div>
        );
    }
}
