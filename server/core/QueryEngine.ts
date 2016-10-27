/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { Database } from './Database';

export class QueryEngine {

    private schema: GraphQLSchema;

    constructor(db: Database) {

        // Define the User type
        const predicateType = new GraphQLObjectType({
            name: 'Predicate',
            fields: {
                name: {
                    type: GraphQLString,
                    resolve: ({ entity, predicate }, {}) => {
                        return predicate.name;
                    }
                },
                values: {
                    type: new GraphQLList(GraphQLString),
                    resolve: ({ entity, predicate }, {}) => {
                        return db.query()('records')
                        .select('value_string')
                        .where({ entity: entity.uid, predicate: predicate.uid })
                        .then((results) => results.map((result) => result.value_string));
                    }
                }
            }
        });


        // Define the User type
        const entityType = new GraphQLObjectType({
            name: 'Entity',
            fields: {
                label: {
                    type: GraphQLString,
                    resolve: (parent, {}) => {
                        return parent.label;
                    }
                },
                type: {
                    type: GraphQLString,
                    resolve: (parent, {}) => {
                        return db.query()('entity_types').where({ uid: parent.type }).first().then((data) => data.name);
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
                }
            }
        });

        // Define the Query type
        const queryType = new GraphQLObjectType({
            name: 'Query',
            fields: {
                entity: {
                    type: new GraphQLList(entityType),
                    // `args` describes the arguments that the `user` query accepts
                    args: {
                        uid: { type: GraphQLString }
                    },
                    resolve: (_, {uid}) => {
                        if (uid === undefined) {
                            return db.query()('entities');
                        }
                        return db.query()('entities').where({ uid });
                    }
                }
            }
        });

        this.schema = new GraphQLSchema({
            query: queryType
        });
    }

    public runQuery(query: any) : Promise<any> {
        return graphql(this.schema, query);
    }
}