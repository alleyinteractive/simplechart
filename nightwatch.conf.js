const SCREENSHOT_PATH = "./tests/artifacts/screenshots/";
const BINPATH = './node_modules/nightwatch/bin/';
// @TODO Diagnose why log-level not working
module.exports = {
  "src_folders" : ["./tests/integration"],
  "output_folder" : "./tests/artifacts/reports",
  "selenium" : {
    "start_process" : true,
    "server_path" : "./node_modules/nightwatch/bin/selenium.jar",
    "host": "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "./node_modules/nightwatch/bin/chromedriver"
    }
  },
  "test_settings" : {
    "default" : {
      "globals": {
        "waitForConditionTimeout": 5000
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled" : true,
        "acceptSslCerts" : true,
        "chromeOptions" : {
          "args" : ["log-level=0"]
        }
      }
    }
  }
}

require('fs').stat(BINPATH + 'selenium.jar', function (err, stat) {
  if (err || !stat || stat.size < 1) {
    require('selenium-download').ensure(BINPATH, function(error) {
      if (error) throw new Error(error)
      console.log('✔ Selenium & Chromedriver downloaded to:', BINPATH);
    });
  }
});


function padLeft (count) {
  return count < 10 ? '0' + count : count.toString();
}

var FILECOUNT = 0;
function imgpath (browser) {
  var a = browser.options.desiredCapabilities;
  var meta = [];
  meta.push(a.browserName ? a.browserName : 'any');
  meta.push(a.name);
  var metadata = meta.join('~').toLowerCase().replace(/ /g, '');
  return SCREENSHOT_PATH + metadata + '_' + padLeft(FILECOUNT++) + '_';
}

module.exports.imgpath = imgpath;
