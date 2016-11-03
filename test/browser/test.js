
const url = 'http://localhost:8080';

const loginToServer = (n) => n.url(url + '/admin')
      .waitForElementVisible('body', 5000)
      .setValue('input[name="username"]', 'thollies')
      .setValue('input[name="password"]', 'password')
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('.page>section>h1', 'Welcome to the admin pages');

const addEntity = (n) => 
  n.click('a[href="/admin/edit/entity"]')
  .pause(1000)
  .click('i.add.button')
  .setValue('input[name="new-entity-name"]', 'New Test Entity')
  .click('div.overlay-container div.combo-dropdown')
  .click('div.dropdown li:nth-of-type(2)')
  .click('button[name="create-entity"]');

module.exports = {
  "Load and login to server" : function (browser) {
    addEntity(loginToServer(browser))
    .pause(1000)
    .expect.element('td').text.to.contain('New Test Entity');
  }
}