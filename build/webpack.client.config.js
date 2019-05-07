const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.config')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const config = merge(base, {
  entry: {
    app: './src/entry-client.js',
  },
  optimization: {
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    runtimeChunk: {
      name: 'manifest',
    },
    // extract vendor chunks for better caching
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test (module) {
            // a module is extracted into the vendor chunk if...
            return (
              // it's inside node_modules
              /node_modules/.test(module.context) &&
              // and not a CSS file (due to extract-text-webpack-plugin limitation)
              !/\.css$/.test(module.request)
            )
          },
        },
      },
    },
  },
  plugins: [
    new CopyPlugin([
      { from:'./src/trace-worker.js', to:'trace-worker.js', },
    ]),    
    new webpack.ProvidePlugin({
      'window.Quill': 'quill',
      'Quill': 'quill/dist/quill.js',
    }),
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"',
    }),
    new VueSSRClientPlugin(),
  ],
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'readr-site',
      filename: 'service-worker.js',
      importScripts: [
        { filename: 'trace-worker.js', },
        // { chunkName: 'trace-worker' },
      ],
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [ /\.map$/, /\.json$/, ],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst',
        },
      ],
    })
  )
}

module.exports = config
