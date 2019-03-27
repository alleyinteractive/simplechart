const path = require('path');
const webpack = require('webpack');
const WebpackGitHash = require('webpack-git-hash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// If hash is passed from command line, e.g. $ npm run build abcd123
const hashProvided = 5 <= process.argv.length &&
  /^[a-z0-9]+$/.test(process.argv[4]);
const modulesDir = path.resolve(__dirname, 'node_modules');
const vendorDir = path.resolve(__dirname, 'app/vendor');

const plugins = [
  new WebpackGitHash({
    cleanup: true,
    skipHash: hashProvided ? process.argv[4] : undefined,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: './index.hbs',
    filename: path.resolve(__dirname, 'index.html'),
    excludeChunks: ['widget'],
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: './widget.hbs',
    filename: path.resolve(__dirname, 'widget.html'),
    chunks: ['widget'],
  }),
];

module.exports = {
  devtool: 'source-map',
  entry: {
    widget: [
      require.resolve('./polyfills'),
      path.resolve('./app/widget'),
    ],
    app: [
      require.resolve('./polyfills'),
      path.resolve('./app/index'),
    ],
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    // },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: '',
    filename: '[name].[githash].js',
    chunkFilename: '[id].[githash].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: modulesDir,
        use: ['eslint-loader'],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'app'),
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        exclude: [modulesDir, vendorDir],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          'html-loader',
          'markdown-loader',
        ],
      },
      {
        test: /\.css$/,
        include: [modulesDir, vendorDir],
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(svg|csv)$/,
        include: [
          path.resolve(__dirname, 'app/img'),
          path.resolve(__dirname, 'app/constants/sampleData')
        ],
        use: ['raw-loader'],
      },
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
      },
    ],
  },
};
