var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

const typescriptLoaderConfig = {
    silent: true, // don't show errors on build
    visualStudioErrorFormat: true,
    ignoreDiagnostics: [
        2307,
        2345, 
        2339 // Property does not exist on type (thrown incorrectly by setState)
    ]
};

const resolve = {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx'],
    modulesDirectories: ["build", "node_modules", "src"],
};

const loaderConfig = [
    { 
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.join(__dirname, '..', 'src')
    },
    { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
        include: path.join(__dirname, 'src')
    },

    { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: "file-loader",
        include: path.join(__dirname, 'src')
    },
];


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
    entry: './src/client/app.frontend',
    output: {  
        path: path.join(__dirname, 'dist', 'server', 'static'),                 // output folder
        filename: './app.frontend.dist.js',    // file name
    },
    resolve: resolve,
    module: {
       loaders: loaderConfig
    },
    target: 'web',
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "lodash": "_"
    },
    ts: typescriptLoaderConfig
}

var backendConfig = {
    devtool: 'source-map',
    entry: './src/server/index',
    output: {  
        path: 'dist/server',                 // output folder
        filename: 'app.backend.dist.js',    // file name
        devtoolModuleFilenameTemplate: "file://[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "file://[absolute-resource-path]?[hash]"
    },
    resolve: resolve,
    module: {
        loaders: loaderConfig
    },
    target: 'node',
    externals: nodeModules,
    ts: typescriptLoaderConfig
}

var electronConfig = {
    devtool: 'source-map',
    entry: './src/app/app.electron',
    output: {  
        path: 'dist/app',                 // output folder
        filename: 'app.electron.dist.js'     // file name
    },
    resolve: resolve,
    module:  {
        loaders: loaderConfig
    },
    target: 'electron-renderer',    
    externals: nodeModules,
    ts: typescriptLoaderConfig
}

var electronAppConfig = {
    devtool: 'source-map',
    entry: './src/app/index',
    output: {  
        path: 'dist/app',                 // output folder
        filename: 'app.electron.index.dist.js'     // file name
    },
    resolve: resolve,
    node: {
        __dirname: false,
        __filename: false
    },
    module:  {
        loaders: loaderConfig
    },
    target: 'electron',    
    externals: nodeModules,
    ts: typescriptLoaderConfig
}

module.exports = [frontendConfig, electronConfig, electronAppConfig, backendConfig];
