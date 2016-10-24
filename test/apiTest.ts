/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.0.1
 */


//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import * as Knex from 'knex';

import { ServerApiService, AppUrls } from '../server/core/ServerApiService';
import { ElementSetPersistable } from '../server/controllers/ElementSetController';
import { wrapDatabase } from '../server/routes/api';
import { Database } from '../server/core/Database';

chai.use(chaiHttp);

let knex;
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite'
  }
};

//Our parent block
describe('Entity', () => {

  before(() => {
    knex = Knex(knexConfig);
  });
    /*
  * Test the /GET route
  */
  describe('/GET entity', () => {

    before((done) => {
        knex('entities').del()
        .then(() => done());
    });

    it('it should GET all entities', (done) => {
        chai.request('http://localhost:8080')
            .get('/api/v1/entity')
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                chai.expect(res.body).to.be.a('array');
                chai.expect(res.body.length).to.equal(0);
                done();
        });
    });
  });

});