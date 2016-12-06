
const Knex = require('knex');
const faker = require('Faker');
const _ = require('lodash');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/mydb.sqlite'
  }
};

const knex = Knex(knexConfig);

// Generate sources
const sources = _.range(10).map(() => {
    return {
        name: faker.Lorem.words().join(' '),
        same_as: _.range(_.random(0, 3)).map((i) => faker.Internet.domainName()).join(','),
        parent: null,
        readonly: false
    };
});



// Generate entity types
const entityTypes = _.range(10).map(() => {
    return {
        name: faker.Lorem.words().join(' '),
        description: faker.Lorem.sentence(),
        parent: null,
        same_as: _.range(_.random(0, 3)).map((i) => faker.Internet.domainName()).join(','),
        colour: _.sample(['red', 'green', 'blue']),
        icon: null,
        readonly: false
    };
});

Promise.all([
    knex('sources').insert(sources, 'uid'),
    knex('entity_types').insert(entityTypes, 'uid')
]).then(() => process.exit(0))


// Generate predicates

// Generate entities

console.log(entityTypes)
