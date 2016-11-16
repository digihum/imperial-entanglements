Feature: Google Search

Scenario: Searching Google

  Given I open the admin pages and log in
  Then the title is "Imperial Entanglements"
  And the main page title is set to "Welcome to the admin pages"
  Then I close the browser

Scenario: Searching Google again

  Given I open the admin pages and log in
  Then the title is "Imperial Entanglements"
  And the main page title is set to "Welcome to the admin pages"
  Then I close the browser
