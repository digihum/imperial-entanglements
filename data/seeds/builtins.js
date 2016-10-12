//import { ENTITY_TYPES_TABLE_NAME } from '../data/symbols/tableNames';
const ENTITY_TYPES_TABLE_NAME = 'entity_types';

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(ENTITY_TYPES_TABLE_NAME).del()
    .then(function () {
       return knex(ENTITY_TYPES_TABLE_NAME).insert(
          {
            name: 'Any',
            description: 'Represents a single thing',
            same_as: '',
            colour: '',
            icon: '',
            readonly: true
          }
       ).returning('uid').then(([id]) => {
         return Promise.all([
          // Inserts seed entries       
            
            knex(ENTITY_TYPES_TABLE_NAME).insert({
              name: 'Person',
              description: 'Represents a single human being',
              same_as: 'http://xmlns.com/foaf/spec/#term_Person',
              colour: 'blue',
              icon: 'person',
              readonly: true,
              parent: id
            }),

            knex(ENTITY_TYPES_TABLE_NAME).insert({
              name: 'Location',
              description: 'Represents a single place',
              same_as: 'http://xmlns.com/foaf/spec/#term_SpatialThing',
              colour: 'red',
              icon: 'place',
              readonly: true,
              parent: id
            }),

            knex(ENTITY_TYPES_TABLE_NAME).insert({
              name: 'Occupation',
              description: 'A profession',
              same_as: '',
              colour: 'green',
              icon: 'job',
              readonly: false,
              parent: id
          })           
        
        ])
       });
    });
};
