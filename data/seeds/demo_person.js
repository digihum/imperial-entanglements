
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entities').del()
    .then(() => knex('entity_types').select('uid').where({ 'name': 'Person' }))
    .then(function ([result]) {
      console.log("test", result.uid)
      return Promise.all([
        // Inserts seed entries
        knex('entities').insert({uid: 1, type: result.uid, label: 'test person 1'}),
        knex('entities').insert({uid: 2, type: result.uid, label: 'test person 2'}),
        knex('entities').insert({uid: 3, type: result.uid, label: 'test person 3'})
      ]);
    });
};
