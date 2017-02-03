const url = 'http://localhost:8080';

module.exports = function () {
  this.Given(/^I open the admin pages and log in$/, function (browser) {
    browser
      .url(url)
      .waitForElementVisible('body', 1000)
      .setValue('input[name="username"]', 'thollies')
      .setValue('input[name="password"]', 'password')
      .click('input[type=submit]');      
  });

  this.Then(/^the title is "([^"]*)"$/, function (browser, title) {
    browser.assert.title(title)
  });

  this.Then(/^the main page title is set to "([^"]*)"$/, function (browser, title) {
    browser.assert.containsText('h1', title)
  });

  this.Then(/^I close the browser$/, function (browser) {
    browser.end();
  });
}
