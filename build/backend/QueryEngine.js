/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const graphql_1 = require("graphql");
const entityQLType_1 = require("./graphql/entityQLType");
const predicateQLType_1 = require("./graphql/predicateQLType");
class QueryEngine {
    constructor(db) {
        const entityType = entityQLType_1.entityQLType(db, predicateQLType_1.predicateQLType(db));
        // Define the Query type
        const queryType = new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: {
                entity: {
                    type: new graphql_1.GraphQLList(entityType),
                    // `args` describes the arguments that the `user` query accepts
                    args: {
                        uid: { type: graphql_1.GraphQLString }
                    },
                    resolve: (_, { uid }) => {
                        if (uid === undefined) {
                            return db.query()('entities');
                        }
                        return db.query()('entities').where({ uid });
                    }
                }
            }
        });
        this.schema = new graphql_1.GraphQLSchema({
            query: queryType
        });
    }
    runQuery(query) {
        return graphql_1.graphql(this.schema, query);
    }
}
exports.QueryEngine = QueryEngine;
//# sourceMappingURL=QueryEngine.js.map