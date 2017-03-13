const conf = require('../../nightwatch.conf.js');

module.exports = {
  'Simplechart assert title'(browser) {
    browser
        .url('http://localhost:8080')
        .waitForElementVisible('body')
        .assert.title('Simplechart')
        .saveScreenshot(`${conf.imgpath(browser)}simplechart.png`)
        .end();
  },
  'Simplechart assert basic use'(browser) {
    browser
        .useXpath()
        .url('http://localhost:8080')
        .waitForElementVisible('//body')
        .waitForElementVisible('//select[@name="sample-data-select"]')
        .click('//select[@name="sample-data-select"] //option[@value="1"]')
        .waitForElementVisible('(//button[@class="Button"])[4]')
        .click('(//button[@class="Button"])[4]')
        .assert.containsText(
            '//p[@class="Text"]',
            'Data input successful'
        )
        .click('(//button[@class="Button"])[3]')
        .assert.containsText(
            '//h2[@class="Heading"]',
            'Chart Type'
        )
        .waitForElementVisible('(//label[@class="Label"])[3]')
        .click('(//label[@class="Label"])[3]')
        .waitForElementVisible('//div[@class="nv-chart"]')
        .click('(//button[@class="Button"])[3]')
        .assert.containsText(
            '//h2[@class="Heading"]',
            'Settings'
        )
        .click('(//button[@class="Button"])[3]')
        .assert.containsText(
            '//h2[@class="Heading"]',
            'Data Format'
        )
        .click('(//button[@class="Button"])[3]')
        .assert.containsText(
            '//h2[@class="Heading"]',
            'Layout'
        )
        .click('(//button[@class="Button"])[1]')
        // @TODO Figure out how to verify save. Console.log not appearing
        .end();
  },
};
