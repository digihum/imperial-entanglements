/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
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