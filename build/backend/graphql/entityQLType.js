/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var graphql_1 = require("graphql");
exports.entityQLType = function (db, predicateType) {
    return new graphql_1.GraphQLObjectType({
        name: 'Entity',
        fields: {
            uid: {
                type: graphql_1.GraphQLString,
                resolve: function (parent, _a) {
                    return parent.uid;
                }
            },
            label: {
                type: graphql_1.GraphQLString,
                resolve: function (parent, _a) {
                    return parent.label;
                }
            },
            type: {
                type: graphql_1.GraphQLString,
                resolve: function (parent, _a) {
                    return db.query()('entity_types').where({ uid: parent.type }).first().then(function (data) { return data.label; });
                }
            },
            predicate: {
                type: predicateType,
                args: {
                    name: { type: graphql_1.GraphQLString },
                    uid: { type: graphql_1.GraphQLString }
                },
                resolve: function (entity, _a) {
                    var name = _a.name, uid = _a.uid;
                    if (name !== undefined) {
                        return db.query()('predicates').where({ name: name }).first().then(function (predicate) { return ({ predicate: predicate, entity: entity }); });
                    }
                    if (uid !== undefined) {
                        return db.query()('predicates').where({ uid: uid }).first().then(function (predicate) { return ({ predicate: predicate, entity: entity }); });
                    }
                }
            },
            predicates: {
                type: new graphql_1.GraphQLList(predicateType),
                args: {
                    names: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                    uids: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) }
                },
                resolve: function (entity, _a) {
                    var names = _a.names, uids = _a.uids;
                    if (names !== undefined) {
                        return db.query()('predicates')
                            .whereIn('name', names)
                            .then(function (predicates) { return predicates.map(function (predicate) { return ({ predicate: predicate, entity: entity }); }); });
                    }
                    if (uids !== undefined) {
                        return db.query()('predicates')
                            .whereIn('uid', uids)
                            .then(function (predicates) { return predicates.map(function (predicate) { return ({ predicate: predicate, entity: entity }); }); });
                    }
                }
            }
        }
    });
};
//# sourceMappingURL=entityQLType.js.map