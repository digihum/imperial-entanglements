const moment = require('moment');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sources').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('sources').insert({
          name: 'Test Source',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()
        })
      ]);
    });
};
