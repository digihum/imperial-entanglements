/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const graphql_1 = require("graphql");
exports.predicateQLType = (db) => {
    return new graphql_1.GraphQLObjectType({
        name: 'Predicate',
        fields: {
            uid: {
                type: graphql_1.GraphQLString,
                resolve: ({ predicate }, {}) => {
                    return predicate.uid;
                }
            },
            name: {
                type: graphql_1.GraphQLString,
                resolve: ({ predicate }, {}) => {
                    return predicate.label;
                }
            },
            values: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                resolve: ({ entity, predicate }, {}) => {
                    return db.query()('records')
                        .select('value_string')
                        .where({ entity: entity.uid, predicate: predicate.uid })
                        .then((results) => results.map((result) => result.value_string));
                }
            }
        }
    });
};
//# sourceMappingURL=predicateQLType.js.map