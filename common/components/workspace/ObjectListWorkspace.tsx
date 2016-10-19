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

interface ObjectListWorkspaceProps {
    api: ApiService;
    name: string;
    listType: string;
}

export const ObjectListWorkspace : React.StatelessComponent<ObjectListWorkspaceProps> =
    (props: ObjectListWorkspaceProps) => (
    <div className='workspace-editor'>
        <h2>All {props.name} <i
            className='fa fa-plus-circle add-button'
            aria-hidden='true'
            onClick={() => this.setState({ creatingRecord : true })}
        ></i></h2>
        {(() => {
            switch(props.listType) {
                case 'entity':
                    return (<EntityList api={props.api} />);
                case 'source':
                    return (<SourceList api={props.api} />);
                case 'predicate':
                    return (<PredicateList api={props.api} />);
            }
        })()}
    </div>
);