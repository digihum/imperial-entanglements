/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 ** @version 0.2.3
 */


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as fs from 'fs';
import * as path from 'path';

import { Database } from '../data/Database';
import { wrapDatabase } from '../data/wrapDatabase';
import { ServerApiService } from '../ServerApiService';

const pathToTestDatabase = './data/test.sqlite';

export let knex : Knex;
export let api : ServerApiService;

before((done) => {

  console.log('SETTING UP DATABASE');

  if (fs.existsSync(pathToTestDatabase)) {
    fs.unlinkSync(pathToTestDatabase);
  }

  const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: pathToTestDatabase
    },
    migrations: {
        directory: path.join(process.cwd(), 'data', 'migrations')
    },
    seeds: {
      directory: path.join(process.cwd(), 'data', 'seeds')
    },
    useNullAsDefault: true
  };
  knex = Knex(knexConfig);

  api = wrapDatabase(new Database(knexConfig), true);

  knex.migrate.latest()
    .then(() => knex.seed.run())
    .then(() => done());
});
