var config = {
    devtool: 'inline-source-map',
    entry: {
        import_data: './client/js/import_data', 
        person_list: './client/js/person_list',
        edit_person: './client/js/person_edit',
        edit_fields: './client/js/fields_edit',
        edit_source: './client/js/source_edit',
   	},
    output: {                     // output folder
        filename: '[name].dist.js'     // file name
    },
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js']
    },
    module: {
    loaders: [
	      {
	        test: /\.html$/,
	        loader: "html"
	      },
	      { 
            test   : /.tsx?$/,
            loaders : ['webpack-typescript', 'babel'],
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
