
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
      knex('predicates').del(),
      knex('predicates_ref').del(),
      knex('predicates_val').del()
    ])
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('predicates').insert({
          name: 'has forename',
          description: 'A forename',
          domain: 'person'
        }).returning('uid'),

        knex('predicates').insert({
          name: 'has brother',
          description: 'Has a male sibling that shares parents',
          domain: 'person'
        }).returning('uid')
      ]);
    })
    .then(function([id1, id2]) {
      return Promise.all([
        // Inserts seed entries
        knex('predicates_val').insert({
          uid: id1, 
          range: 'string'
        }),

        knex('predicates_ref').insert({
          uid: id2, 
          range: 'person'
        }),
      ]);
    });
};
