/**
 * @fileOverview <Description Missing>
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as React from 'react';

import { GeneralStatistics } from '../common/stats/GeneralStatistics';
import { StatsGrid } from '../common/stats/StatsGrid';

// ideally:
// - Open file
// - Recent files
// - Metrics

interface AdminAppProps {
  stats: GeneralStatistics | null;
}

export const AdminApp = (props: AdminAppProps) => (
    <div className='page'>
        <section>
            <h1>VRE App</h1>
            {props.stats !== null ? (
              <StatsGrid stats={props.stats} />
            ) : null}
        </section>
     </div>
);
