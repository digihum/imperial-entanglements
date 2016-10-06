
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entities').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('entities').insert({uid: 1, type: 'person'}),
        knex('entities').insert({uid: 2, type: 'person'}),
        knex('entities').insert({uid: 3, type: 'person'})
      ]);
    });
};
