#!/usr/bin/env node

const program = require('commander');

const Knex = require('knex');
const bcrypt = require('bcrypt');

const databaseConnection = {
  useNullAsDefault: true,
  connection: {}
};

databaseConnection.client = 'sqlite3';
if (databaseConnection.connection !== undefined ) {
    databaseConnection.connection.filename = './data/mydb.sqlite';
}
databaseConnection.pool = {
    afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
    }
};

const knex = Knex(databaseConnection);

const userOperations = {

    add: (username, options) => {
        const pass = options.password || bcrypt.genSaltSync(10);

        knex('users').insert({
            name: '',
            username: username,
            email: '',
            password: bcrypt.hashSync(pass, 10),
            account_level: 1
        }).then(() => {
            console.log("Success");
            process.exit(0);
        }).catch((err) => {
            console.error(err);
        });
    },

    remove: (username) => {

        knex('users')
        .select()
        .where({
            username: username
        })
        .del()
        .then(() => {
            console.log("Success");
            process.exit(0);
        }).catch((err) => {
            console.error(err);
        });
    }
};

program
  .version('0.0.1')
  .command('user <operation> <username>')
  .description('Perform operations on users - valid operations are add/remove')
  .option('--password [pass]','Default password')
  .action((operation, username, options) => {

    userOperations[operation](username, options);
   
  });
program.parse(process.argv);
