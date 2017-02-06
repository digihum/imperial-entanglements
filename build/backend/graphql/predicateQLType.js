/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var graphql_1 = require("graphql");
exports.predicateQLType = function (db) {
    return new graphql_1.GraphQLObjectType({
        name: 'Predicate',
        fields: {
            uid: {
                type: graphql_1.GraphQLString,
                resolve: function (_a, _b) {
                    var predicate = _a.predicate;
                    return predicate.uid;
                }
            },
            name: {
                type: graphql_1.GraphQLString,
                resolve: function (_a, _b) {
                    var predicate = _a.predicate;
                    return predicate.label;
                }
            },
            values: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                resolve: function (_a, _b) {
                    var entity = _a.entity, predicate = _a.predicate;
                    return db.query()('records')
                        .select('value_string')
                        .where({ entity: entity.uid, predicate: predicate.uid })
                        .then(function (results) { return results.map(function (result) { return result.value_string; }); });
                }
            }
        }
    });
};
//# sourceMappingURL=predicateQLType.js.map