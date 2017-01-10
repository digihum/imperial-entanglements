/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ComboDropdown } from '../ComboDropdown';
import { DataController } from '../../stores/DataController';

import { AppUrls } from '../../ApiService';

import { toString } from 'lodash';

interface SearchBoxProps {
    onChange : React.EventHandler<React.FormEvent>;
    searchString: string;
    dataStore: DataController;

}

export const SearchBox : React.StatelessComponent<SearchBoxProps> = (props : SearchBoxProps, context: any) => {

    const entities = props.dataStore!.dataStore.all.entity.value.map((entity) =>
        ({ key: entity.label, value: toString(entity.uid), meta: { itemType: AppUrls.entity } }));

    const entityTypes = props.dataStore!.dataStore.all.entity_type.value.map((entityType) =>
        ({ key: entityType.label, value: toString(entityType.uid), meta: { itemType: AppUrls.entity_type }  }));

    const predicates = props.dataStore!.dataStore.all.predicate.value.map((predicate) =>
        ({ key: predicate.label, value: toString(predicate.uid), meta: { itemType: AppUrls.predicate }  }));

    const sources = props.dataStore!.dataStore.all.source.value.map((source) =>
        ({ key: source.label, value: toString(source.uid), meta: { itemType: AppUrls.source }  }));

    const all = entities.concat(entityTypes, predicates, sources);


    return (
        <span>
            <div className='input-addon-formgroup'>
                <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
                <ComboDropdown
                    value={{ key: '', value: ''}}
                    setValue={(val) => {
                      if (val !== null) {
                        context.router.transitionTo(`/edit/${val.meta.itemType}/${val.value}`)
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
