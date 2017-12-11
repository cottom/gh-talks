const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const resolve = v => path.resolve(__dirname, v)

const isDevelopment = process.env.NODE_ENV === 'development'
let plugins = [
  new ExtractTextPlugin('index.css'),
  new CleanWebpackPlugin([isDevelopment ? 'doc' : 'dist']),
]
const appEntry = isDevelopment ? {app: resolve('example/test.js')} : {}
if (isDevelopment) {
  plugins = plugins.concat([
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'example/index.html',
      chunks: ['index', 'app']
    }),
    new HtmlWebpackPlugin({
      filename: 'callback.html',
      template: 'example/callback.html',
      chunks: ['iframe']
    })
  ])
} else plugins.push(new UglifyJSPlugin())

module.exports = {
  entry: {
    index: resolve('src/index.ts'),
    iframe: resolve('src/iframe.ts'),
    ...appEntry
  },
  devtool: isDevelopment && 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [['env', {
              targets: {'browsers': ['last 2 versions', 'safari >= 7']}
            }]],
            plugins: [
              'add-module-exports'
            ]
          }
        }, 'ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
      }
    ],
  },
  devServer: {
    contentBase: './doc'
  },
  resolve: {
    extensions: [ '.ts', '.js', '.styl' ]
  },
  output: {
    filename: '[name].js',
    path: isDevelopment ? resolve('doc') : resolve('dist'),
    library: 'GhTalk',
    libraryTarget: 'var',
    publicPath: isDevelopment ? '/' : './'
  },
  plugins
}
