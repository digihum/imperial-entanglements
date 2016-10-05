/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { expect } from 'chai';
import * as Knex from 'knex';

import { ServerApiService } from '../server/core/ServerApiService';
import { ElementSet } from '../common/datamodel/AbstractSource';
import { AppUrls } from '../common/routeUrls';
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

      apiService.postItem(AppUrls.elementSet, new ElementSet().fromJson({
        uri: 'example.com',
        name: 'example',
        description: 'a example set',
        uid: null
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
