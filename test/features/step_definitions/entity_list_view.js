
module.exports = function () {
    this.Then(/^I add an entity called "([^"]*)"$/, function (browser, label) {
        browser
            .click('i.add.button')
            .setValue('input[name="new-entity-name"]', label)
            .click('div.overlay-container div.combo-dropdown')
            .click('div.dropdown li:nth-of-type(2)')
            .click('button[name="create-entity"]');
    });
}
