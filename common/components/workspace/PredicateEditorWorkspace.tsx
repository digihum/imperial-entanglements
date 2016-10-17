/**
 * @fileOverview Predicate editor workspace
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as React from 'react';

import { SameAsEditor } from '../SameAsEditor';
import { Loading } from '../Loading';
import { ApiService, AppUrls } from '../../ApiService';

import { Predicate, EntityType } from '../../../common/datamodel/datamodel';

import { EditableHeader, EditableFieldComponent } from '../fields/EditableHeader';
import { EditableParagraph } from '../fields/EditableParagraph';
import { PredicateDescription } from '../fields/PredicateDescription';
import { ComboDropdownOption } from '../ComboDropdown';

class StringEditableFieldComponent extends EditableFieldComponent<string> {}

interface PredicateEditorProps {
    api: ApiService;
    id: number;
}

interface PredicateEditorState {
    predicate : Predicate | null;
    entityTypes: EntityType[] | null;
}

// - Should state the number of times this predicate is used
// - Widening the domain or range always okay
// - Narrowing should check for conflicts and return them 
// - Asks 'Delete conflicting records?'
// - Strong check (double button press or type) to confirm
// - Changing name/description/sameAs - absolutly fine
// - Cannot change 'readonly'
export class PredicateEditorWorkspace extends React.Component<PredicateEditorProps, PredicateEditorState> {

    constructor() {
        super();
        this.state = {
            predicate: null,
            entityTypes: null
        };
    }

    public componentDidMount() {
        Promise.all([
            this.props.api.getItem(Predicate, AppUrls.predicate, this.props.id),
            this.props.api.getCollection(EntityType, AppUrls.entityType, {})
        ]).then(([predicate, entityTypes]) => {
            this.setState({ predicate, entityTypes });
        });
    }

    public componentWillReceiveProps(newProps: PredicateEditorProps) {
        if (newProps.id !== this.props.id) {
            this.props.api.getItem(Predicate, AppUrls.predicate, newProps.id).then((data) => {
                this.setState({ predicate: data });
            });
        }
    }

    public updatePredicate(field: string, value: string) {

        if (this.state.predicate === null) {
            console.warn('Tried to edit unready predicate');
            return;
        }

        this.props.api.patchItem(Predicate, AppUrls.predicate, this.state.predicate.uid, { [field]: value })
        .then((success) => {
            this.setState({
                predicate: new Predicate().deserialize(Object.assign({}, this.state.predicate.serialize(), { [field]: value }))
            });
        });
    }

    public render() {

        if (this.state.predicate === null || this.state.entityTypes === null) {
            return (<Loading />);
        }

        let currentDomainEntityType =
            this.state.entityTypes.find((t) => t.uid == this.state.predicate.domain);

        let currentDomainEntityTypeName = '';

        if (currentDomainEntityType !== undefined) {
            currentDomainEntityTypeName = currentDomainEntityType.name;
        }

        const m : ComboDropdownOption = {key: currentDomainEntityTypeName, value: this.state.predicate.domain.toString()};

        if (this.state.predicate.rangeIsReference) {
            
        }

        return (
            <div className='workspace-editor'>

                <StringEditableFieldComponent
                    value={this.state.predicate.name}
                    component={EditableHeader}
                    onChange={(value) => this.updatePredicate('name', value)}  />

                <StringEditableFieldComponent
                    value={this.state.predicate.description}
                    component={EditableParagraph}
                    onChange={(value) => this.updatePredicate('description', value)}  />

                <PredicateDescription
                    domain={m}
                    range={{key: '', value:''}}
                    domainChanged={(value) => this.updatePredicate('domain', value.value)}
                    rangeChanged={(value) => this.updatePredicate('range', value.value)}
                    mode='editSingle'
                    domainOptions={[]}
                    rangeOptions={[]}
                 />

                <div>
                    <SameAsEditor sameAsString='a,b,c,woot,list' />
                </div>
            </div>
        );
    }
}