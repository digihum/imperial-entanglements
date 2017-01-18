/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { Database } from '../data/Database';

export const entityQLType = (db: Database, predicateType: GraphQLObjectType) : GraphQLObjectType => {
    return new GraphQLObjectType({
        name: 'Entity',
        fields: {

            uid: {
                type: GraphQLString,
                resolve: (parent, {}) => {
                    return parent.uid;
                }
            },

            label: {
                type: GraphQLString,
                resolve: (parent, {}) => {
                    return parent.label;
                }
            },

            type: {
                type: GraphQLString,
                resolve: (parent, {}) => {
                    return db.query()('entity_types').where({ uid: parent.type }).first().then((data) => data.label);
                }
            },

            predicate: {
                type: predicateType,
                args: {
                    name: { type: GraphQLString },
                    uid: { type: GraphQLString }
                },
                resolve: (entity, {name, uid}) => {
                    if (name !== undefined) {
                        return db.query()('predicates').where({ name }).first().then((predicate) => ({ predicate, entity }));
                    }
                    if (uid !== undefined) {
                        return db.query()('predicates').where({ uid }).first().then((predicate) => ({ predicate, entity }));
                    }
                }
            },

            predicates: {
                type: new GraphQLList(predicateType),
                args: {
                    names: { type: new GraphQLList(GraphQLString) },
                    uids: { type: new GraphQLList(GraphQLString) }
                },
                resolve: (entity, {names, uids}) => {
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


