/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import * as Knex from 'knex';

import { GeneralStatistics } from '../../common/stats/GeneralStatistics';

export const GeneralStatisticsController = (db : Knex) : Promise<GeneralStatistics> => {

    return Promise.all([
      db('entities').count(),
      db('entity_types').count(),
      db('sources').count(),
      db('records').count(),
      db('predicates').count()
    ]).then(([[entityCount], [entityTypeCount], [sourceCount], [recordCount], [predicateCount]]) => {

      const statistics : GeneralStatistics = {
        entity: entityCount['count(*)'],
        entityType: entityTypeCount['count(*)'],
        source: sourceCount['count(*)'],
        record: recordCount['count(*)'],
        predicate: predicateCount['count(*)']
      };

      return statistics;
    });
};
