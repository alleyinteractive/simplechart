const path = require('path');
const webpack = require('webpack');

const modulesDir = path.resolve(__dirname, 'node_modules');
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
  devtool: 'sourcemap',
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
        exclude: modulesDir,
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
          'html-loader',
          'markdown-loader',
        ],
      },
      {
        test: /\.css$/,
        include: modulesDir,
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
