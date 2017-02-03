/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';
import { Link } from 'react-router';
import { GeneralStatistics } from '../stats/GeneralStatistics';
import { StatsGrid } from '../stats/StatsGrid';

interface AdminProps {
  stats: GeneralStatistics | null;
  tabsets: any[];
}

const setTabList = (data: any, router: any) => {
  window.localStorage.setItem('open_tabs', JSON.stringify(data));
  router.transitionTo('/edit/empty');
};

const deleteTabSet = (id: number) => {
  fetch('/tabset/' + id, {
    method: 'DELETE',
    credentials: 'same-origin'
  });
};

export const Admin : React.StatelessComponent<AdminProps> = (props : AdminProps, context: any) => (
    <div className='page'>
        <section>
            <h1>Welcome to the admin pages</h1>
            <ul className='links-list'>
                <li><Link to='/users'><i className='fa fa-users'></i> Manage Users</Link></li>
                <li><Link to='/app'><i className='fa fa-download'></i> Download app</Link></li>
                <li><a href='/snapshot'><i className='fa fa-cloud-download'></i> Download database snapshot</a></li>
                <li><Link to='/upload'><i className='fa fa-cloud-upload'></i> Upload database file</Link></li>
            </ul>
        </section>
        <section>
          <h2>Saved Tab Sets</h2>
          <ul className='links-list'>
          { props.tabsets.map((tabset) => {
            return (<li key={`tabset-${tabset.uid}`}>
              <span className='a'>
                <span onClick={() => setTabList(tabset.tabs, context.router)}>{tabset.name}</span>
                <span><i className='fa fa-times' onClick={() => deleteTabSet(tabset.uid)}></i></span>
              </span>
            </li>);
          })}
          </ul>
        </section>
        {props.stats !== null ? (
          <StatsGrid stats={props.stats} />
        ) : null}
     </div>
);

Admin.contextTypes = {
  router: React.PropTypes.object.isRequired
};
