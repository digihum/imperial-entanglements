// vendor-bundles.webpack.config.js
const webpack = require('webpack')

const testFolder = './node_modules/';
const fs = require('fs');

module.exports = {
  entry: {
    // create two library bundles, one with jQuery and
    // another with Angular and related libraries
    'mobx': ['mobx', 'mobx-react', 'mobx-react-devtools'],
    'utility': ['lodash', 'lunr', 'moment'],
    'react': ['react-router', 'react-sortable-hoc'],
    'ui': ['mousetrap']
  },

  output: {
    filename: '[name].bundle.js',
    path: 'dist/static/',

    // The name of the global variable which the library's
    // require() function will be assigned to
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      path: 'dist/[name]-manifest.json',
      // The name of the global variable which the library's
      // require function has been assigned to. This must match the
      // output.library option above
      name: '[name]_lib'
    }),
  ],
}
