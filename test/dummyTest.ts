/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { expect } from 'chai';
import * as Knex from 'knex';

import { ServerApiService, AppUrls } from '../server/core/ServerApiService';
import { ElementSetPersistable } from '../server/controllers/ElementSetController';
import { wrapDatabase } from '../server/routes/api';
import { Database } from '../server/core/Database';

let knex;
let apiService : ServerApiService;
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
};

describe('A simple test', () => {

  before(() => {
    knex = Knex(knexConfig);
    apiService = wrapDatabase(new Database(knexConfig));
  });

  describe('on the element_sets table', () => {

    before((done) => {
      knex('element_sets')
      .del()
      .then(() => done());
    });

    it('to check things work', (done) => {

      apiService.postItem(ElementSetPersistable, AppUrls.element_set, new ElementSetPersistable().fromSchema({
        uri: 'example.com',
        name: 'example',
        description: 'a example set'
      }))
      .then((success) => {
       // expect(isNumber(result[0])).to.be.equal(true, 'insert query returned a non-numeric value');

        knex('element_sets')
        .count()
        .first()
        .then((result) => {
          expect(result['count(*)']).to.equal(1);
          done();
        });
      });
    });
  });
});
