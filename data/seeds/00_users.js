
var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  //Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([

        knex('users').insert({
          name: 'Unknown',
          username: 'unknown',
          password: bcrypt.hashSync('', 10),
          email: '',
          account_level: 1
        })
        
      ]);
    });
};
