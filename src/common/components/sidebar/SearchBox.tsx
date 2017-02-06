/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';
import { StringComboDropdown, ComboDropdownOption } from '../ComboDropdown';
import { DataController } from '../../stores/DataController';

import { AppUrls } from '../../ApiService';

interface SearchBoxProps {
    searchString: string;
    dataStore: DataController;
}

export const SearchBox : React.StatelessComponent<SearchBoxProps> = (props : SearchBoxProps, context: any) => {

    const entities : ComboDropdownOption<string>[] = props.dataStore!.dataStore.all.entity.value.map((entity) =>
        ({ key: entity.label, value: `${AppUrls.entity}/${entity.uid}`}));

    const entityTypes : ComboDropdownOption<string>[]  = props.dataStore!.dataStore.all.entity_type.value.map((entityType) =>
        ({ key: entityType.label, value: `${AppUrls.entity_type}/${entityType.uid}` }));

    const predicates : ComboDropdownOption<string>[]  = props.dataStore!.dataStore.all.predicate.value.map((predicate) =>
        ({ key: predicate.label, value: `${AppUrls.predicate}/${predicate.uid}`  }));

    const sources : ComboDropdownOption<string>[]  = props.dataStore!.dataStore.all.source.value.map((source) =>
        ({ key: source.label, value: `${AppUrls.source}/${source.uid}`  }));

    const all : ComboDropdownOption<string>[]  = entities.concat(entityTypes, predicates, sources);


    return (
        <span>
            <div className='input-addon-formgroup'>
                <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
                <StringComboDropdown
                    value={{ key: '', value: null}}
                    setValue={(val) => {
                      if (val !== null) {
                        context.router.transitionTo(`/edit/${val.value}`)
                      }
                    }}
                    typeName='all'
                    options={all}
                    allowNew={false}
                    createNewValue={() => {}}
                />
            </div>
        </span>
    );

};

SearchBox.contextTypes = {router: React.PropTypes.object.isRequired};
