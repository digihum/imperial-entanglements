/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */

import { expect } from 'chai';
import * as Knex from 'knex';
import { isNumber } from 'lodash';

import { GenericController } from '../server/controllers/GenericController';
import { ElementSet } from '../common/datamodel/AbstractSource';

import { view, edit } from '../common/views/ElementSets';

let knex;
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
};

describe('A simple test', () => {

  before(() => {
    knex = Knex(knexConfig);
  });

  describe('on the element_sets table', () => {

    before((done) => {
      knex('element_sets')
      .del()
      .then(() => done());
    });

    it('to check things work', (done) => {
      const controller = new GenericController<ElementSet>(knexConfig, 'element_sets');
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