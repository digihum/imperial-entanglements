
require('nightwatch-cucumber')({
  nightwatchClientAsParameter: true,
  /* other configuration options */
  "featureFiles": ["src/client/__spec__/features"],
  "stepDefinitions": ["config/step_definitions"],
  "jsonReport": "reports/cucumber.json",
  "htmlReport": "reports/cucumber.html"
})

module.exports = {
  "src_folders" : [],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "config/nightwatch.globals",

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
