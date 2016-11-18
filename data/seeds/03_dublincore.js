
const dublinCoreData = require('../reference/dublin_core.json');

// dublin core: http://dublincore.org/documents/2012/06/14/dcmi-terms/

exports.seed = function(knex, Promise) {

  const elementSetsTableName = 'element_sets';
  const elementsTableName = 'elements';

  const tableData = dublinCoreData.map((data, i) => {
    return {
      uid: i,
      uri: data["URI"],
      element_set: 1,
      name: data["Term Name"],
      description: data["Definition"] + (data["Comment"] !== undefined ? (" - " + data["Comment"]) : ""),
      comment: data["Note"]
    }
  });

  // Deletes ALL existing entries
  return knex(elementSetsTableName).del()
    .then(() => 
        knex(elementSetsTableName).insert({
          uid: 1, 
          name: 'Dublin Core', 
          description: 'The Dublin Core metadata element set is common to all Omeka records, including items, files, and collections. For more information see, http://dublincore.org/documents/dces/.'
        })
    ).then(() => 
       knex(elementsTableName).del()
      .then(() => knex(elementsTableName).insert(tableData))
    );
};
