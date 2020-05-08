const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const baseManifest = require('./chrome/manifest.json');

const config = {
  mode: 'production',
  entry: {
    /**
     * Statics
     */
    popup: path.join(__dirname, './chrome/static/popup.js'),

    /**
     * Scripts
     */
    detector: path.join(__dirname, './chrome/scripts/detector.js'),
    background: path.join(__dirname, './chrome/scripts/background.js'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  plugins: [
    /**
     * Popup
     */
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './chrome/static/popup.html',
      chunks: ['popup'],
      excludeChunks: ['detector', 'background'],
    }),

    /**
     * Plugins
     */
    new CopyPlugin([
      {
        from: 'chrome/icons',
        to: 'icons',
      },
    ]),
    new CopyPlugin([
      {
        from: 'chrome/_locales',
        to: '_locales',
      },
    ]),
    new WebpackExtensionManifestPlugin({
      config: {
        base: baseManifest,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
};

module.exports = config;