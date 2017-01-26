process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import * as chaiPromise from 'chai-as-promised';

import './testHelper';

chai.use(chaiPromise);

import { entityTests } from './entityTests';
import { predicateTests } from './predicateTests';
import { sourceTests } from './sourceTests';

describe('Falcon API', () => {
  entityTests(chai);
  predicateTests(chai);
  sourceTests(chai);
});
