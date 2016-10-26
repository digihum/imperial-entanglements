/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { createTab } from '../Signaller';

interface AddTabButtonProps {
    tabType: string;
    uid: number;
    data?: any;
}

export const AddTabButton : React.StatelessComponent<AddTabButtonProps> =
    (props: AddTabButtonProps) => (
        <i className='icon-list-add add-button'
                    onClick={() => createTab.dispatch(props.tabType, props.uid, props.data)}></i>
    );