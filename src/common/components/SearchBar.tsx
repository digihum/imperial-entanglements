/**
 * @fileOverview Sidebar for editor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';

interface SearchBarProps {
    setFilterFunc: (f: (a : any) => boolean) => void;
    getValue: (a: any) => string;
}

export const SearchBar : React.StatelessComponent<SearchBarProps>
    = (props: SearchBarProps) => {

    const filterFunc = (s: string) => {
        return (a: any) => {
            if (s.length === 0) {
                return true;
            }
            return props.getValue(a).toLowerCase().indexOf(s.toLowerCase()) !== -1;
        };
    };

    return (
        <div>
            <div className='input-addon-formgroup'>
                <span className='input-addon-icon'><i className='fa fa-search fa-fw'></i></span>
                <input type='text'
                    className='form-control with-addon'
                    onChange={(e) => props.setFilterFunc(filterFunc((e.target as HTMLInputElement).value))}/>
            </div>

        </div>
    );
};
