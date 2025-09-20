const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || 'production';
  const isProd = mode === 'production';

  return {
    mode,
    entry: path.resolve(__dirname, 'src', 'server.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'server.cjs',
      libraryTarget: 'commonjs2',
      clean: true
    },
    resolve: { extensions: ['.js', '.json'] },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    devtool: isProd ? 'source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: [],
          exclude: /node_modules/
        }
      ]
    },
    optimization: {
      minimize: false
    },
    node: { __dirname: false, __filename: false },
    performance: { hints: false }
  };
};
