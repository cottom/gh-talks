const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const resolve = v => path.resolve(__dirname, v)

const isDevelopment = process.env.NODE_ENV === 'development'
let plugins = [
  new ExtractTextPlugin('index.css'),
  new CleanWebpackPlugin(['dist']),
  CopyWebpackPlugin([
    {
      from: resolve('example/docs'),
      to: resolve('dist'),
      ignore: ['index.html']
    }
  ])
]

if (isDevelopment) {
  plugins = plugins.concat([
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'example/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'callback.html',
      template: 'example/callback.html',
      chunks: ['iframe']
    })
  ])
}

module.exports = {
  entry: {
    index: resolve('src/index.ts'),
    iframe: resolve('src/iframe.ts')
  },
  devtool: isDevelopment ? 'source-map' : null,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env'],
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
    contentBase: './dist'
  },
  resolve: {
    extensions: [ '.ts', '.js', '.styl' ]
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    library: 'GhTalk',
    libraryTarget: 'var'
  },
  plugins
}
