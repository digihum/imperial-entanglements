/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
exports.GeneralStatisticsController = (db) => {
    const countVarName = db.client.config.client === 'pg' ? 'count' : 'count(*)';
    return Promise.all([
        db('entities').count(),
        db('entity_types').count(),
        db('sources').count(),
        db('records').count(),
        db('predicates').count()
    ]).then(([[entityCount], [entityTypeCount], [sourceCount], [recordCount], [predicateCount]]) => {
        const statistics = {
            entity: entityCount[countVarName],
            entityType: entityTypeCount[countVarName],
            source: sourceCount[countVarName],
            record: recordCount[countVarName],
            predicate: predicateCount[countVarName]
        };
        return statistics;
    });
};
//# sourceMappingURL=GeneralStatisticsController.js.map