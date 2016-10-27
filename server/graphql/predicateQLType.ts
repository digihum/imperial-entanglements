/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { Database } from '../core/Database';

export const predicateQLType = (db: Database) : GraphQLObjectType => {
        return new GraphQLObjectType({
        name: 'Predicate',
        fields: {

            uid: {
                type: GraphQLString,
                resolve: ({ predicate }, {}) => {
                    return predicate.uid;
                }
            },

            name: {
                type: GraphQLString,
                resolve: ({ predicate }, {}) => {
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
};