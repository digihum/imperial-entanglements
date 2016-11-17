/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { createTab } from '../Signaller';
import { DataStore } from '../DataStore';

interface AddTabButtonProps {
    tabType: string;
    uid: number;
    dataStore: DataStore;
    data?: any;
}

export const AddTabButton : React.StatelessComponent<AddTabButtonProps> =
    (props: AddTabButtonProps, context: any) => {

        if (props.dataStore.tabs[props.tabType] !== undefined
                && props.dataStore.tabs[props.tabType].has(`${props.tabType}-${props.uid}`)) {
            return (<i className='fa fa-folder-open-o add button'
                title='Open item'
                onClick={() => context.router.transitionTo(`/edit/${props.tabType}/${props.uid}`)}> </i>);
        }

        return (
        <i className='icon-list-add add button'
            title='Add to list'
            onClick={() => createTab.dispatch(props.tabType, props.uid, props.data)}></i>
)};

AddTabButton.contextTypes = {
    router: React.PropTypes.object.isRequired
};