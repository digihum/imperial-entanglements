var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var ClosureCompilerPlugin = require('webpack-closure-compiler');


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
    entry: {
        //"app.frontend": './src/client/app.frontend.ts', 
        "app.frontend": './build/client/app.frontend.js'
	},
    output: {  
        path: 'dist/server/static',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'build'), 'node_modules']
    },
    module:  {
        rules: [
           // { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
       // new webpack.optimize.UglifyJsPlugin()
    ],
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "lodash": "_"
    }
}

var backendConfig = {
    devtool: 'source-map',
    entry: {
        //"app.backend": './src/server/index.ts', 
        "app.backend": './build/server/index.js', 
	},
    output: {  
        path: 'dist/server',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'build'), 'node_modules']
    },
    module:  {
        rules: [
            {
                enforce: 'pre',
                test:   /\.js$/,
                loader: 'source-map-loader'
            },
           // { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    target: 'node',
    externals: nodeModules
}

var electronConfig = {
    devtool: 'source-map',
    entry: {
        //"app.electron": './src/app/app.electron.ts'
        "app.electron": './build/app/app.electron.js'
	},
    output: {  
        path: 'dist/app',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'build'), 'node_modules']
    },
    module:  {
        rules: [
            {
                enforce: 'pre',
                test:   /\.js$/,
                loader: 'source-map-loader'
            },
            
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },

            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            },

            //{ test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [

        // swap out /common/datamodel/datamodel with app/app.datamodel to inject
        // server side models into the frontend!

        new webpack.NormalModuleReplacementPlugin(
            /common\/datamodel\/datamodel/,
            require.resolve('./build/app/app.datamodel')
        )
    ],
    target: 'electron-renderer',    
    externals: nodeModules
}

var electronAppConfig = {
    devtool: 'source-map',
    entry: {
        //"app.electron": './src/app/app.electron.ts'
        "app.electron.index": './build/app/index.js'
	},
    output: {  
        path: 'dist/app',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'build'), 'node_modules']
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module:  {
        rules: [
            {
                enforce: 'pre',
                test:   /\.js$/,
                loader: 'source-map-loader'
            },
            
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },

            { 
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            },

            //{ test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    },
    plugins: [

        // swap out /common/datamodel/datamodel with app/app.datamodel to inject
        // server side models into the frontend!
    ],
    target: 'electron',    
    externals: nodeModules
}

module.exports = [frontendConfig, electronConfig, electronAppConfig, backendConfig];
