/**
 * @fileOverview Empty workspace for when nothing is open!
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */

import * as React from 'react';

import { EntityList } from '../object_list/EntityList';
import { PredicateList } from '../object_list/PredicateList';
import { SourceList } from '../object_list/SourceList';
import { EntityTypeList } from '../object_list/EntityTypeList';

interface ObjectListWorkspaceProps {
    listType: string;
    query: any;
}

export const ObjectListWorkspace : React.StatelessComponent<ObjectListWorkspaceProps> =
    (props: ObjectListWorkspaceProps) => (
    <div className='workspace-editor object-list'>
        {(() => {
            switch(props.listType) {
                case 'entity':
                    return (<EntityList query={props.query} />);
                case 'source':
                    return (<SourceList />);
                case 'predicate':
                    return (<PredicateList />);
                case 'entity_type':
                    return (<EntityTypeList />);
            }
        })()}
    </div>
);
