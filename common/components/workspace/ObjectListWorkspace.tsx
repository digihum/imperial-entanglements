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
}

export const ObjectListWorkspace : React.StatelessComponent<ObjectListWorkspaceProps> =
    (props: ObjectListWorkspaceProps) => (
    <div className='workspace-editor'>
        {(() => {
            switch(props.listType) {
                case 'entity':
                    return (<EntityList api={props.api} dataStore={props.dataStore} />);
                case 'source':
                    return (<SourceList api={props.api} />);
                case 'predicate':
                    return (<PredicateList api={props.api} />);
                case 'entity_type':
                    return (<EntityTypeList api={props.api} />);
            }
        })()}
    </div>
);