/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.1.0
 */

import * as React from 'react';
import { Link } from 'react-router';
import { GeneralStatistics } from '../stats/GeneralStatistics';

interface AdminProps {
  stats: GeneralStatistics | null;
}

export const Admin = (props : AdminProps) => (
    <div className='page'>
        <section>
            <h1>Welcome to the admin pages</h1>
            <ul>
                <li>Manage Users</li>
                <li>Download app</li>
                <li><a href='/admin/snapshot'>Download database snapshot</a></li>
            </ul>
        </section>
        {props.stats !== null ? (
        <section className='stats-grid'>

          <Link to='/edit/entity'>
            <div className='entity'>
              <span className='item-name'>Entities</span><span className='item-count'>{props.stats.entity}</span>
            </div>
          </Link>

          <Link to='/edit/entity_type'>
            <div className='entity_type'>
              <span className='item-name'>Entity Types</span><span className='item-count'>{props.stats.entityType}</span>
            </div>
          </Link>

          <Link to='/edit/source'>
            <div className='source'>
              <span className='item-name'>Sources</span><span className='item-count'>{props.stats.source}</span>
            </div>
          </Link>

          <Link to='/edit/predicate'>
            <div className='predicate'>
              <span className='item-name'>Properties</span><span className='item-count'>{props.stats.predicate}</span>
            </div>
          </Link>

          <div className='record'>
            <span className='item-name'>Records</span><span className='item-count'>{props.stats.record}</span>
          </div>

        </section>
        ) : null}

     </div>
);
