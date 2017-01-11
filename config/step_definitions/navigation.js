module.exports = function () {
  this.Given(/^I have navigated to the "([^"]*)" page$/, function (browser, page) {
    browser
      .useXpath().click("//*[contains(text(), '" + page + "')]")
      .pause(1000);

    browser.useCss();
  });

  this.Then(/^the header of the workspace is "([^"]*)"$/, function (browser, title) {
    browser.assert.containsText('div.main-toolbar>h2', title);
  });
}
