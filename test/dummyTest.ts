/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { expect } from 'chai';
import * as Knex from 'knex';
import { isNumber } from 'lodash';

import { ElementSetController } from '../server/controllers/ElementSetController';
import { ElementSet } from '../server/datamodel/AbstractSource';

let knex;

describe('A simple test', () => {

  before(() => {
    knex = Knex({
      client: 'sqlite3',
      connection: {
        filename: './mydb.sqlite'
      }
    });
  });

  describe('on the element_sets table', () => {

    before((done) => {
      knex('element_sets')
      .del()
      .then(() => done());
    });

    it('to check things work', (done) => {
      const controller = new ElementSetController();
      controller.postItem(new ElementSet({
        uri: 'example.com',
        name: 'example',
        description: 'a example set',
        uid: null
      }))
      .then((result) => {

        expect(isNumber(result[0])).to.be.equal(true, 'insert query returned a non-numeric value');

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