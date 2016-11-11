
var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  //Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          uid: 1, 
          name: 'Tim Hollies',
          username: 'thollies',
          password: bcrypt.hashSync('password', 10),
          email: 'tim.hollies@warwick.ac.uk',
          account_level: 1
        }),

        knex('users').insert({
          uid: 0, 
          name: 'Unknown',
          username: 'unknown',
          password: bcrypt.hashSync('', 10),
          email: '',
          account_level: 1
        }),
      ]);
    });
};
