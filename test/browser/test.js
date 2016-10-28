module.exports = {
  "Google Loads" : function (browser) {
    browser
      .url("https://www.google.co.uk")
      .waitForElementVisible('body', 5000)
      .assert.elementPresent('input.gsfi')
      .end();
  }
}