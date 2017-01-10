/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { DataController } from '../stores/DataController';

import { inject, observer } from 'mobx-react';

interface AddTabButtonProps {
    tabType: string;
    uid: number;
    dataStore?: DataController;
    data?: any;
}

export const AddTabButton : React.ClassicComponentClass<AddTabButtonProps> = inject('dataStore')(observer(
    (props: AddTabButtonProps, context: any) => {

        if (props.dataStore!.dataStore.tabs[props.tabType] !== undefined
                && props.dataStore!.dataStore.tabs[props.tabType].has(`${props.tabType}-${props.uid}`)) {
            return (<i className='fa fa-folder-open-o add button'
                title='Open item'
                onClick={() => context.router.transitionTo(`/edit/${props.tabType}/${props.uid}`)}> </i>);
        }

        return (
        <i className='icon-list-add add button'
            title='Add to list'
            onClick={() => props.dataStore!.createTab(props.tabType, props.uid, 'item', props.data)}></i>
)}));

AddTabButton.wrappedComponent.contextTypes = {
    router: React.PropTypes.object.isRequired
};
