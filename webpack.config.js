const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || 'production';
  const isProd = mode === 'production';

  return {
    target: 'node20',
    mode,
    entry: path.resolve(__dirname, 'src', 'server.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'server.cjs',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    devtool: isProd ? 'source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: false,
                configFile: 'tsconfig.json'
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    optimization: { minimize: false },
    node: { __dirname: false, __filename: false },
    performance: { hints: false }
  };
};
