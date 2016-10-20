/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { createTab } from '../Signaller';

interface AddTabButtonProps {
    title: string;
    subtitle: string;
    url: string;
    tabType: string;
}

export const AddTabButton : React.StatelessComponent<AddTabButtonProps> =
    (props: AddTabButtonProps) => (
        <i className='icon-list-add add-button'
                    onClick={() => createTab.dispatch(props.title, props.subtitle, props.url, props.tabType)}></i>
    );