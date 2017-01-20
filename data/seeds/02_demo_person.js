
const moment = require('moment');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('entities').del()
    .then(() => knex('entity_types').select('uid').where({ 'label': 'Person' }))
    .then(function ([result]) {
      console.log("test", result.uid)
      return Promise.all([
        // Inserts seed entries

        knex('entities').insert({
          type: result.uid, 
          label: 'test person 1',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()}),

        knex('entities').insert({
          type: result.uid, 
          label: 'test person 2',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()}),

        knex('entities').insert({
          type: result.uid, 
          label: 'test person 3',
          creator: 1,
          creation_timestamp: moment().toISOString(),
          lastmodified_timestamp: moment().toISOString()}),

        
      ]);
    });
};
