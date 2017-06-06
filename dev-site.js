const express = require('express');
const fs = require('fs');
const path = require('path');

// Parse hash from app.1234abc.js
// Ok to assume there's only one such file in /static
function getStaticVersion() {
  return fs.readdirSync(path.join(__dirname, 'static'))
    .reduce((carry, filename) => {
      const matches = /^app\.(\w+)\.js$/.exec(filename);
      return matches ? matches[1] : carry;
    }, null);
}

// Update app and vendor filenames with provided version or pick from /static
const version = process.argv[2] || getStaticVersion();
if (version) {
  const indexPath = path.join(__dirname, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');

  // replace app.js or app.1234abc.js with new version
  const newHtml = indexHtml.replace(
    /(app|vendor)(?:\.\w+)?\.js/g,
    (match, substr) => `${substr}.${version}.js`
  );
  fs.writeFileSync(indexPath, newHtml);
}

// Start serving
const app = new express();
app.use(express.static('./'));
app.listen(
  process.env.PORT || 8080,
  () => console.log('Dev site is up and running')
);
