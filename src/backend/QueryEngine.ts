/**
 * @fileOverview Query processor
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

import { Database } from './data/Database';

import { entityQLType } from './graphql/entityQLType';
import { predicateQLType } from './graphql/predicateQLType';

export class QueryEngine {

    private schema: GraphQLSchema;

    constructor(db: Database) {

        const entityType = entityQLType(db, predicateQLType(db));

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
