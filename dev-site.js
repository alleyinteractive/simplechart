const express = require('express');
const fs = require('fs');
const path = require('path');

// Change filename if a version is provided
const version = process.argv[2] || null;
if (version) {
  const indexPath = path.join(__dirname, 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(indexPath, indexHtml.replace('app.js', `app.${version}.js`));
}

// Start serving
const app = new express();
app.use(express.static('./'));
app.listen(
  process.env.PORT || 8080,
  () => console.log('Dev site is up and running')
);
