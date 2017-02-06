/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var graphql_1 = require("graphql");
var entityQLType_1 = require("./graphql/entityQLType");
var predicateQLType_1 = require("./graphql/predicateQLType");
var QueryEngine = (function () {
    function QueryEngine(db) {
        var entityType = entityQLType_1.entityQLType(db, predicateQLType_1.predicateQLType(db));
        // Define the Query type
        var queryType = new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                entity: {
                    type: new graphql_1.GraphQLList(entityType),
                    // `args` describes the arguments that the `user` query accepts
                    args: {
                        uid: { type: graphql_1.GraphQLString }
                    },
                    resolve: function (_, _a) {
                        var uid = _a.uid;
                        if (uid === undefined) {
                            return db.query()('entities');
                        }
                        return db.query()('entities').where({ uid: uid });
                    }
                }
            }
        });
        this.schema = new graphql_1.GraphQLSchema({
            query: queryType
        });
    }
    QueryEngine.prototype.runQuery = function (query) {
        return graphql_1.graphql(this.schema, query);
    };
    return QueryEngine;
}());
exports.QueryEngine = QueryEngine;
//# sourceMappingURL=QueryEngine.js.map