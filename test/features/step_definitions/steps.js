const url = 'http://localhost:8080';

module.exports = function () {
  this.Given(/^I open the admin pages and log in$/, function () {
    this
      .url(url + '/admin')
      .waitForElementVisible('body', 1000)
      .setValue('input[name="username"]', 'thollies')
      .setValue('input[name="password"]', 'password')
      .click('input[type=submit]');      
  });

  this.Then(/^the title is "([^"]*)"$/, function (title) {
    this.assert.title(title)
  });

  this.Then(/^the main page title is set to "([^"]*)"$/, function (title) {
    this.assert.containsText('h1', title).end();
  });
}
