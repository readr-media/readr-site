const baseConfig = require('../../build/webpack.base.config')
const webpack = require('webpack')
const webpackConfig = Object.assign({}, baseConfig, {
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"test"',
    }),
  ],
})

delete webpackConfig.entry
module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS', ],
    frameworks: [ 'mocha', 'sinon-chai', 'phantomjs-shim', ],
    reporters: [ 'spec', 'coverage', ],
    files: [
      './index.js',
      '../../node_modules/es6-promise/dist/es6-promise.auto.js',
    ],
    preprocessors: {
      './index.js': [ 'webpack', 'sourcemap', 'coverage', ],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        // { type: 'lcov', subdir: '.' },
        // { type: 'text-summary' }
        // reporters not supporting the `file` property
        { type: 'html', subdir: 'report-html', },
        { type: 'lcov', subdir: 'report-lcov', },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        { type: 'cobertura', subdir: '.', file: 'cobertura.txt', },
        { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt', },
        { type: 'teamcity', subdir: '.', file: 'teamcity.txt', },
        { type: 'text', subdir: '.', file: 'text.txt', },
        { type: 'text-summary', subdir: '.', file: 'text-summary.txt', },
      ],
    },
  })
}
