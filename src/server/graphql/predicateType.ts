  // Define the User type
        const predicateType = new GraphQLObjectType({
            name: 'Predicate',
            fields: {
                name: {
                    type: GraphQLString,
                    resolve: ({ entity, predicate }, {}) => {
                        return predicate.label;
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
