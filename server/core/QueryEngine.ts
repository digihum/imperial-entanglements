/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { Database } from './Database';

export class QueryEngine {

    private schema: GraphQLSchema;

    constructor(db: Database) {


        // Define the User type
        const entityType = new GraphQLObjectType({
            name: 'Entity',
            fields: {
                label: {
                    type: GraphQLString,
                    resolve: (parent, {}) => {
                        return parent.label;
                    }
                }
            }
        });

        // Define the Query type
        const queryType = new GraphQLObjectType({
            name: 'Query',
            fields: {
                entity: {
                    type: entityType,
                    // `args` describes the arguments that the `user` query accepts
                    args: {
                        uid: { type: GraphQLString }
                    },
                    resolve: (_, {uid}) => {
                        return db.query()('entities').select(['label']).where({ uid }).first();
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