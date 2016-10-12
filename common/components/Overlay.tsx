/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:jd@example.com">John Doe</a>
 * @version 3.1.2
 */

import * as React from 'react';

interface OverlayProps {

}

interface OverlayState{

}

export class Overlay extends React.Component<OverlayProps, OverlayState> {

    public render() {
        return (
        <div className='full-page-overlay'>
            <div className='overlay-container'>
                {this.props.children}
            </div>
        </div>
        );
    }
};