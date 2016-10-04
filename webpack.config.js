var config = {
    devtool: 'inline-source-map',
    entry: {
        app: './build/client/render.js', 
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
module.exports = config;
