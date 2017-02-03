/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
const graphql_1 = require("graphql");
exports.entityQLType = (db, predicateType) => {
    return new graphql_1.GraphQLObjectType({
        name: 'Entity',
        fields: {
            uid: {
                type: graphql_1.GraphQLString,
                resolve: (parent, {}) => {
                    return parent.uid;
                }
            },
            label: {
                type: graphql_1.GraphQLString,
                resolve: (parent, {}) => {
                    return parent.label;
                }
            },
            type: {
                type: graphql_1.GraphQLString,
                resolve: (parent, {}) => {
                    return db.query()('entity_types').where({ uid: parent.type }).first().then((data) => data.label);
                }
            },
            predicate: {
                type: predicateType,
                args: {
                    name: { type: graphql_1.GraphQLString },
                    uid: { type: graphql_1.GraphQLString }
                },
                resolve: (entity, { name, uid }) => {
                    if (name !== undefined) {
                        return db.query()('predicates').where({ name }).first().then((predicate) => ({ predicate, entity }));
                    }
                    if (uid !== undefined) {
                        return db.query()('predicates').where({ uid }).first().then((predicate) => ({ predicate, entity }));
                    }
                }
            },
            predicates: {
                type: new graphql_1.GraphQLList(predicateType),
                args: {
                    names: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                    uids: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
                },
                resolve: (entity, { names, uids }) => {
                    if (names !== undefined) {
                        return db.query()('predicates')
                            .whereIn('name', names)
                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
                    }
                    if (uids !== undefined) {
                        return db.query()('predicates')
                            .whereIn('uid', uids)
                            .then((predicates) => predicates.map((predicate) => ({ predicate, entity })));
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=entityQLType.js.map