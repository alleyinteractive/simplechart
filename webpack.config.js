const path = require('path');
const update = require('immutability-helper');
const webpack = require('webpack');
const WebpackGitHash = require('webpack-git-hash');
const updateVersion = require('./updateVersion');
const isDevelopment = 'development' === process.env.NODE_ENV;

let config = {
  devtool: 'cheap-source-map',
  entry: {
    widget: [
      path.resolve('./app/widget'),
    ],
    app: [
      path.resolve('./app/index'),
    ],
  },
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: isDevelopment ? 'http://localhost:8080/static/' : '',
    filename: isDevelopment ? '[name].js' : '[name].[githash].js',
    chunkFilename: isDevelopment ? '[id].chunk.js' : '[id].[githash].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        const context = module.context;
        return context && 0 <= context.indexOf('node_modules');
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'app'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
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
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
      },
    ],
  },
};

if (isDevelopment) {
  config = update(config, {
    devtool: {
      $set: 'sourcemap',
    },
    entry: {
      app: {
        $unshift: [
          'react-hot-loader/patch',
          'webpack/hot/only-dev-server',
          'webpack-dev-server/client?http://localhost:8080',
        ],
      },
    },
    plugins: {
      $unshift: [
        new webpack.HotModuleReplacementPlugin(),
      ],
    },
  });
}

if (!isDevelopment) {
  // If hash is passed from command line, e.g. $ npm run build abcd123
  const hashProvided = 5 <= process.argv.length &&
    /^[a-z0-9]+$/.test(process.argv[4]);

  config = update(config, {
    plugins: {
      $unshift: [
        new WebpackGitHash({
          cleanup: true,
          callback: updateVersion,
          skipHash: hashProvided ? process.argv[4] : undefined,
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
        }),
      ],
    },
  });
}

if (process.env.MOCKAPI) {
  config = update(config, {
    entry: {
      $unset: 'app',
    },
  });
}

/**
 * Export the full Webpack config, note that publicPath is set in app/widget entry points
 * per https://webpack.github.io/docs/configuration.html#output-publicpath
 */
module.exports = config;
