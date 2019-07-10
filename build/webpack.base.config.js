const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd
    ? 'production'
    : 'development',
  devtool: isProd
    ? false
    : '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../distribution'),
    publicPath: '/distribution/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': path.resolve(__dirname, '../public'),
      'src': path.resolve(__dirname, '../src'),
      'components': path.resolve(__dirname, '../src/components'),
      'api': path.resolve(__dirname, '../api')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: isProd
          ? [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
          : [ 'vue-style-loader', 'css-loader', 'postcss-loader' ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: [
    new VueLoaderPlugin(),
    ...isProd
      ? [
        new MiniCssExtractPlugin({
          filename: 'common.[chunkhash].css'
        })
      ]
      : [
        new FriendlyErrorsPlugin()
      ]
  ]
}
