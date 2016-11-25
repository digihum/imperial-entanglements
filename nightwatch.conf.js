
require('nightwatch-cucumber')({
  nightwatchClientAsParameter: true,
  /* other configuration options */
  "featureFiles": ["test/features"],
  "stepDefinitions": ["test/features/step_definitions"],
  "jsonReport": "test/reports/cucumber.json",
  "htmlReport": "test/reports/cucumber.html"
})

module.exports = {
  "src_folders" : ["test/browser"],
  "output_folder" : "test/reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "test/nightwatch.globals",

  "selenium" : {
    "start_process" : false
  },

  "test_settings" : {
    "default" : {
      // screenshots : {
      //   enabled : true,
      //   on_failure : true,
      //   path: 'test/screenshots'
      // },
      "selenium_port"  : 9515,
      "selenium_host"  : "localhost",
      "default_path_prefix" : "",

      "desiredCapabilities": {
        "browserName": "chrome",
        "chromeOptions" : {
          "args" : ["--no-sandbox"]
        },
        "acceptSslCerts": true
      }
    }
  }
}
