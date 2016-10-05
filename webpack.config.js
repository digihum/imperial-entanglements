var frontendConfig = {
    devtool: 'inline-source-map',
    entry: {
        "app.frontend": './build/client/app.frontend.js', 
	},
    output: {  
        path: 'build/static',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['', '.js']
    },
    module: {
    loaders: [
	      { 
            test   : /.js?$/,
            loaders : ['babel'],
            exclude: /node_modules/
          }
	    ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "lodash": "_"
    }
}

var electronConfig = {
    devtool: 'inline-source-map',
    entry: {
        "app.electron": './build/app/app.electron.js'
	},
    output: {  
        path: 'build/static',                 // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['', '.js']
    },
    target: 'node',
    externals: {
        "knex": "commonjs knex"
    }
}

module.exports = [frontendConfig, electronConfig];
