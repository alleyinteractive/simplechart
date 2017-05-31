const path = require('path');
const webpack = require('webpack');

const entry = {
  widget: [
    path.resolve('./app/widget'),
  ],
};

if (!process.env.MOCKAPI) {
  entry.app = [
    path.resolve('./app/index'),
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8080',
  ];
}

module.exports = {
  devtool: 'sourcemap',
  entry,
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: 'http://localhost:8080/static/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
