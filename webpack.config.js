const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      app: './src/main.tsx',
      background: './src/background.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'public/manifest.json', to: 'manifest.json' },
          { from: 'public/icons', to: 'icons', noErrorOnMissing: true },
          { from: 'public/sergei-gussev-010yr9rFtIc-unsplash.jpg', to: 'sergei-gussev-010yr9rFtIc-unsplash.jpg' }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunks: ['app']
      })
    ],
    watch: isDevelopment,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
    devtool: isDevelopment ? 'inline-source-map' : false
  };
};