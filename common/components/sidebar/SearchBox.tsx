/**
 * @fileOverview Searchboc for sidebar
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';

interface SearchBoxProps {
    onChange : React.EventHandler<React.FormEvent>;
    searchString: string;
}

export const SearchBox = (props : SearchBoxProps) => (
    <span>
        <div className='input-addon-formgroup'>
            <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
            <input type='text' onChange={props.onChange} value={props.searchString} className='form-control with-addon' />
        </div>
    </span>
);
