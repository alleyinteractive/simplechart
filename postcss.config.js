const webpack = require('webpack');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCustomProps = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const postcssCalc = require('postcss-calc');
const postcssColorFunction = require('postcss-color-function');
const postcssMixins = require('postcss-mixins');
const stylelint = require('stylelint');

module.exports = {
  plugins: [
    postcssImport({
      addDependencyTo: webpack,
    }),
    postcssMixins,
    postcssNested,
    postcssCustomProps,
    autoprefixer,
    postcssCalc,
    postcssColorFunction,
    stylelint(require('./stylelint.config.js')),
  ],
};
