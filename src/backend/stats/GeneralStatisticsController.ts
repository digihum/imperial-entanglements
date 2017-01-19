/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import * as Knex from 'knex';

import { GeneralStatistics } from '../../common/stats/GeneralStatistics';

export const GeneralStatisticsController = (db : Knex) : Promise<GeneralStatistics> => {

  const countVarName = db.client.config.client === 'pg' ? 'count' : 'count(*)';

    return Promise.all([
      db('entities').count(),
      db('entity_types').count(),
      db('sources').count(),
      db('records').count(),
      db('predicates').count()
    ]).then(([[entityCount], [entityTypeCount], [sourceCount], [recordCount], [predicateCount]]) => {

      const statistics : GeneralStatistics = {
        entity: entityCount[countVarName],
        entityType: entityTypeCount[countVarName],
        source: sourceCount[countVarName],
        record: recordCount[countVarName],
        predicate: predicateCount[countVarName]
      };

      return statistics;
    });
};
