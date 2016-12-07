module.exports = {
	'Simplechart Assert Title': function(browser) {
		browser
			.url('http://localhost:8080')
			.waitForElementVisible('body')
			.assert.title('Simplechart')
			.saveScreenshot('tests/artifacts/screenshots/simplechart.png')
			.end();
	}
};
