const path = require('path');
const webpack = require('webpack');

const modulesDir = path.resolve(__dirname, 'node_modules');
const vendorDir = path.resolve(__dirname, 'app/vendor');
const entry = {
  widget: [
    path.resolve(__dirname, 'app/widget'),
  ],
};

if (!process.env.MOCKAPI) {
  entry.app = [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/index'),
  ];
}

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry,
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: 'http://localhost:8080/static/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
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
    ],
  },
};
