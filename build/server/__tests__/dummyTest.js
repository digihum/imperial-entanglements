/**
 * @fileOverview Dummy test to see if tests work
 * @author <a href="mailto:tim.hollies@warwick.ac.uk">Tim Hollies</a>
 * @version 0.2.0
 */
"use strict";
var knex;
var apiService;
var knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/mydb.sqlite'
    }
};
// describe('A simple test', () => {
//   before(() => {
//     knex = Knex(knexConfig);
//     apiService = wrapDatabase(new Database(knexConfig), true);
//   });
//   describe('on the element_sets table', () => {
//     before((done) => {
//       knex('element_sets')
//       .del()
//       .then(() => done());
//     });
//     it('to check things work #api', (done) => {
//       apiService.postItem(ElementSet, AppUrls.element_set, Serializer.fromJson(ElementSet, {
//         uri: 'example.com',
//         label: 'example',
//         description: 'a example set'
//       }))
//       .then((success) => {
//        // expect(isNumber(result[0])).to.be.equal(true, 'insert query returned a non-numeric value');
//         knex('element_sets')
//         .count()
//         .first()
//         .then((result) => {
//           expect(result['count(*)']).to.equal(1);
//           done();
//         });
//       });
//     });
//   });
// });
//# sourceMappingURL=dummyTest.js.map