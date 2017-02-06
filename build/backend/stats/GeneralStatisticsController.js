/**
 * @fileOverview Map of URIs to controllers
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
exports.GeneralStatisticsController = function (db) {
    var countVarName = db.client.config.client === 'pg' ? 'count' : 'count(*)';
    return Promise.all([
        db('entities').count(),
        db('entity_types').count(),
        db('sources').count(),
        db('records').count(),
        db('predicates').count()
    ]).then(function (_a) {
        var entityCount = _a[0][0], entityTypeCount = _a[1][0], sourceCount = _a[2][0], recordCount = _a[3][0], predicateCount = _a[4][0];
        var statistics = {
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