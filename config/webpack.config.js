var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

function isVendor(module, count) {
  const userRequest = module.userRequest;

  // You can perform other similar checks here too.
  // Now we check just node_modules.
  return userRequest && userRequest.indexOf('node_modules') >= 0;
}

const resolve = {
    extensions: ['.js'],
    modules: ["node_modules", "build"],
};

const loaderConfig = [
    { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        use: ["url-loader?limit=10000&mimetype=application/font-woff"],
        include: path.join(__dirname, 'src')
    },

    { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        use: ["file-loader"],
        include: path.join(__dirname, 'src')
    },
];

const dllPath = path.join(__dirname, '..', 'dist');


var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var frontendConfig = {
    devtool: 'source-map',
    entry: './build/client/app.frontend',
    output: {  
        path: path.join(__dirname, '..', 'dist', 'static'),                 // output folder
        filename: './[name].dist.js',    // file name
    },
    resolve: resolve,
    module: {
       rules: loaderConfig
    },
    target: 'web',
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "lodash": "_"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: isVendor,
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(path.join(dllPath, 'mobx-manifest.json'))
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(path.join(dllPath, 'utility-manifest.json'))
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(path.join(dllPath, 'ui-manifest.json'))
        }),
        new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(path.join(dllPath, 'react-manifest.json'))
        })
    ]
}

var electronConfig = {
    devtool: 'source-map',
    entry: './build/app/app.electron',
    output: {  
        path: 'dist/app',                 // output folder
        filename: 'app.electron.dist.js'     // file name
    },
    resolve: resolve,
    module:  {
        rules: loaderConfig
    },
    target: 'electron-renderer',    
    externals: nodeModules
}

module.exports = [frontendConfig, electronConfig];
