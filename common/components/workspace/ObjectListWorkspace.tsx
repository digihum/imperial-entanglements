/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { ApiService } from '../../ApiService';

import { EntityList } from '../object_list/EntityList';
import { PredicateList } from '../object_list/PredicateList';
import { SourceList } from '../object_list/SourceList';
import { EntityTypeList } from '../object_list/EntityTypeList';

import { DataStore } from '../../DataStore';

interface ObjectListWorkspaceProps {
    api: ApiService;
    name: string;
    listType: string;
    dataStore: DataStore;
    query: any;
}

export const ObjectListWorkspace : React.StatelessComponent<ObjectListWorkspaceProps> =
    (props: ObjectListWorkspaceProps) => (
    <div className='workspace-editor object-list'>
        {(() => {
            switch(props.listType) {
                case 'entity':
                    return (<EntityList api={props.api} query={props.query} dataStore={props.dataStore} />);
                case 'source':
                    return (<SourceList api={props.api} dataStore={props.dataStore} />);
                case 'predicate':
                    return (<PredicateList api={props.api} dataStore={props.dataStore} />);
                case 'entity_type':
                    return (<EntityTypeList api={props.api} dataStore={props.dataStore} />);
            }
        })()}
    </div>
);