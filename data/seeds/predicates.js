
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('predicates').del(),
      knex('predicates_ref').del(),
      knex('predicates_val').del()
    ])
    .then(() => knex('entity_types').select('uid').where({ 'name': 'Person' }))
    .then(function ([result]) {
      return Promise.all([
        // Inserts seed entries
        knex('predicates').insert({
          name: 'has forename',
          description: 'A forename',
          domain: result.uid
        }).returning('uid'),

        knex('predicates').insert({
          name: 'has brother',
          description: 'Has a male sibling that shares parents',
          domain: result.uid
        }).returning('uid'),

       knex('entity_types').select('uid').where({ 'name': 'Person' })
      ]);
    })
    .then(function([id1, id2, result]) {
      return Promise.all([
        // Inserts seed entries
        knex('predicates_val').insert({
          uid: id1, 
          range: 'string'
        }),

        knex('predicates_ref').insert({
          uid: id2, 
          range: result[0].uid
        }),
      ]);
    });
};
