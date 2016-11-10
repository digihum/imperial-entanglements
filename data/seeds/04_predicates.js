const moment = require('moment');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('predicates').del()
    ])
    .then(() => knex('entity_types').select('uid').where({ 'name': 'Person' }))
    .then(function ([result]) {
      return Promise.all([
        // Inserts seed entries
        knex('predicates').insert({
          name: 'has forename',
          description: 'A forename',
          domain: result.uid,
          range_type: 'string',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()
        }).returning('uid'),

        knex('predicates').insert({
          name: 'has brother',
          description: 'Has a male sibling that shares parents',
          domain: result.uid,
          range_type: 'entity',
          range_ref: result.uid,
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()
        }).returning('uid')        
      ]);
    }).then(() => knex('entity_types').select('uid').where({ 'name': 'Any' }))
    .then(function ([result]) {
      return Promise.all([
        knex('predicates').insert({
          name: 'is mentioned',
          description: 'The entity is referenced in some manner within the source',
          domain: result.uid,
          range_type: 'source',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()
        }).returning('uid'),

        knex('predicates').insert({
          name: 'is not mentioned',
          description: 'The researcher searched for information about this entity within the source but did not find any reference.',
          domain: result.uid,
          range_type: 'source',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()
        }).returning('uid')
      ]);
    });
};
