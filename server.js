const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    chunkModules: false,
    colors: true,
  },
  setup(app) {
    if (process.env.MOCKAPI) {
      require('./mock-api')(app);
    }
  },
}).listen(8080, 'localhost', (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:8080/');
  return null;
});
