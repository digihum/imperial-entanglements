/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ComboDropdown } from '../ComboDropdown';
import { DataStore } from '../../DataStore';

import { AppUrls } from '../../ApiService';

interface SearchBoxProps {
    onChange : React.EventHandler<React.FormEvent>;
    searchString: string;
    dataStore: DataStore;
}

export const SearchBox = (props : SearchBoxProps, context: any) => {

    const entities = props.dataStore.all.entity.value.map((entity) =>
        ({ key: entity.label, value: entity.uid, meta: { itemType: AppUrls.entity } }));

    const entityTypes = props.dataStore.all.entity_type.value.map((entityType) =>
        ({ key: entityType.label, value: entityType.uid, meta: { itemType: AppUrls.entity_type }  }));

    const predicates = props.dataStore.all.predicate.value.map((predicate) =>
        ({ key: predicate.label, value: predicate.uid, meta: { itemType: AppUrls.predicate }  }));

    const sources = props.dataStore.all.source.value.map((source) =>
        ({ key: source.label, value: source.uid, meta: { itemType: AppUrls.source }  }));

    const all = entities.concat(entityTypes, predicates, sources);


    return (
        <span>
            <div className='input-addon-formgroup'>
                <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
                <ComboDropdown
                    value={{ key: '', value: ''}}
                    setValue={(val) => {
                        context.router.transitionTo(`/edit/${val.meta.itemType}/${val.value}`)
                    }}
                    typeName='all'
                    options={all}
                    allowNew={false}
                    createNewValue={() => {}}
                />
            </div>
        </span>
    );

} ;

SearchBox.contextTypes = {router: React.PropTypes.object.isRequired};
