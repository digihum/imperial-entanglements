
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('sources').insert({
          name: 'Test Source'
        })
      ]);
    });
};
