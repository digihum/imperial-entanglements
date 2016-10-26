/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../fields/SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Predicate, EntityType, Record } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { PredicateDescription } from '../fields/PredicateDescription';
import { ComboDropdownOption } from '../ComboDropdown';

import { literalTypes } from '../../literalTypes';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface PredicateEditorProps {
    api: ApiService;
    id: number;
}

interface PredicateEditorState {
    predicate : Predicate | null;
    entityTypes: EntityType[] | null;
    records: Record[] | null;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them 
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
export class PredicateEditorWorkspace extends React.Component<PredicateEditorProps, PredicateEditorState> {

    public static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            predicate: null,
            entityTypes: null,
            records: null
        };
    }

    public componentDidMount() {
        this.loadData(this.props);
    }

    public componentWillReceiveProps(newProps: PredicateEditorProps) {
        this.loadData(newProps);
    }

    public loadData(props: PredicateEditorProps) {
        Promise.all([
            props.api.getItem(Predicate, AppUrls.predicate, props.id),
            props.api.getCollection(EntityType, AppUrls.entity_type, {}),
            props.api.getCollection(Record, AppUrls.record, { predicate: props.id })
        ]).then(([predicate, entityTypes, records]) => {
            this.setState({ predicate, entityTypes, records });
        });
    }

    public updatePredicate(field: string, value: string, rangeIsReferenceOverride: boolean | null = null) {

        if (this.state.predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }

        const rangeIsReferenceVal = rangeIsReferenceOverride === null
            ? this.state.predicate.rangeIsReference : rangeIsReferenceOverride;

        this.props.api.patchItem(Predicate, AppUrls.predicate, this.state.predicate.uid,
        {
            [field]: value,
            rangeIsReference: rangeIsReferenceVal
        })
        .then((success) => {
            this.setState({
                predicate: new Predicate().deserialize(Object.assign({}, this.state.predicate.serialize(), { [field]: value }))
            });
        });
    }

    public del() {
        this.props.api.delItem(Predicate, AppUrls.predicate, this.props.id)
        .then(() => {
            console.log('passed');
        })
        .catch(() => {
            console.log('failed');
        });
    }

    public render() {

        if (this.state.predicate === null ||
                this.state.entityTypes === null ||
                this.state.records === null) {
            return (<Loading />);
        }

        const currentDomainEntityType =
            this.state.entityTypes.find((t) => t.uid == this.state.predicate.domain);

        let currentDomainEntityTypeName = '';

        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.name;
        }

        const domain : ComboDropdownOption = {key: currentDomainEntityTypeName, value: this.state.predicate.domain.toString()};

        const range : ComboDropdownOption = {key: '', value: this.state.predicate.range.toString()};

        if (this.state.predicate.rangeIsReference) {
            const currentRangeEntityType =
                this.state.entityTypes.find((t) => t.uid == this.state.predicate.range);

            if (currentRangeEntityType !== undefined) {
                range.key = currentRangeEntityType.name;
            }

        } else {
           range.key = this.state.predicate.range.toString();
        }

        const entityTypeOptions = this.state.entityTypes.map((t) => {
            if (t.uid === null) {
                throw new Error('Encountered entity type with no id!');
            }
            return { key: t.name, value: t.uid.toString() };
        });

        return (
            <div className='workspace-editor'>
                <i
                    className='fa fa-trash delete-button'
                     aria-hidden='true'
                     onClick={this.del.bind(this)}
                ></i>
                <div className='edit-group'>
                    <label>Name</label>
                    <StringEditableFieldComponent
                        value={this.state.predicate.name}
                        component={EditableHeader}
                        onChange={(value) => this.updatePredicate('name', value)}  />
                </div>

                <div>Count: {this.state.records.length} 
                (TODO: this should link to the search page showing all records with this predicate)</div>

                <div className='edit-group'>
                    <label>Description</label>
                    <StringEditableFieldComponent
                        value={this.state.predicate.description}
                        component={EditableParagraph}
                        onChange={(value) => this.updatePredicate('description', value)}  />
                </div>

                <div className='edit-group'>
                    <label>Typing</label>
                    <PredicateDescription
                        domain={domain}
                        range={range}
                        domainChanged={(value) => this.updatePredicate('domain', value.value)}
                        rangeChanged={(value) => this.updatePredicate('range', value.value, value.meta !== 'literal')}
                        mode='editSingle'
                        domainOptions={entityTypeOptions}
                        rangeOptions={literalTypes.map((t) => ({ key: t.name, value: t.name, meta: 'literal'})).concat(entityTypeOptions)}
                    />
                </div>

                <div>
                    <StringEditableFieldComponent
                        value={this.state.predicate.sameAs}
                        component={SameAsEditor}
                        onChange={(value) => this.updatePredicate('sameAs', value)} />
                </div>
            </div>
        );
    }
}