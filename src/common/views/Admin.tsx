/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';
import { GeneralStatistics } from '../stats/GeneralStatistics';
import { StatsGrid } from '../stats/StatsGrid';

interface AdminProps {
  stats: GeneralStatistics | null;
  tabsets: any[];
}

const setTabList = (data: any) => {
  window.localStorage.setItem('open_tabs', data);
};

export const Admin = (props : AdminProps) => (
    <div className='page'>
        <section>
            <h1>Welcome to the admin pages</h1>
            <ul className='links-list'>
                <li><Link to='/users'><i className='fa fa-users'></i> Manage Users</Link></li>
                <li><Link to='/app'><i className='fa fa-download'></i> Download app</Link></li>
                <li><a href='/admin/snapshot'><i className='fa fa-cloud-download'></i> Download database snapshot</a></li>
                <li><Link to='/upload'><i className='fa fa-cloud-upload'></i> Upload database file</Link></li>
            </ul>
        </section>
        {props.stats !== null ? (
          <StatsGrid stats={props.stats} />
        ) : null}

        { props.tabsets.map((tabset) => {
          return (<div onClick={() => setTabList(tabset.tabs)} key={`tabset-{tabset.name}`}>{tabset.name}</div>);
        })}
     </div>
);
