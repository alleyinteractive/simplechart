var conf = require('../../nightwatch.conf.js');

module.exports = {
	'Simplechart Assert Title': function(browser) {
		browser
			.url('http://localhost:8080')
			.waitForElementVisible('body')
			.assert.title('Simplechart')
			.saveScreenshot(conf.imgpath(browser) + 'simplechart.png')
			.end();
	}
};
