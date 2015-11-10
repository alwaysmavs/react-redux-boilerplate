var path = require('path');
var webpack = require('webpack');


/* =============================================================
 *  config for path
 * ============================================================ */
var node_modules_dir = path.join(__dirname, 'node_modules');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');


/* =============================================================
 *  plugins settings
 * ============================================================ */
/* minimize js,css,img... */
var UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
		minimize: true,
		compress: {
	        warnings: false
	    }
	});

/* html generate automatically */
var HtmlWebpackPlugin = require('html-webpack-plugin');
	
/* expose the value to global */
var ProvidePlugin = new webpack.ProvidePlugin({
		$: "jquery",
	    jQuery: "jquery",
	    "window.jQuery": "jquery"
	});

/* browserSync */
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var BrowserSyncPlugin = new BrowserSyncPlugin({
	host: 'localhost',
	port: 3000,
	server: { baseDir: ['build/'] }
});

/* common chunks */
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

/* ExtractText */
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CssExtractPlugin = new ExtractTextPlugin("[name].css");

// merge
var merge = require('webpack-merge');
var TARGET = process.env.npm_lifecycle_event;





/* =============================================================
 *  base settings
 * ============================================================ */
var common = {
	entry: {
    	app: ['react','jquery', 'app']
    	// app: path.resolve(ROOT_PATH, 'app/components/app/app.js')
    },
    output: {
        filename: '[name].js'
    },
    module: {
		loaders: [
			//jsx
			{
				test: /\.(jsx|js)?$/,
      			loader: 'babel',
      			include: APP_PATH
			},
			//css
			{
				test: /\.css$/,
      			loader: 'style!css',
      			include: APP_PATH
			},
		    //url loader
		    {
		    	test: /\.(png|jpg)$/,
		    	loader: 'url?limit=25000',
				include: APP_PATH
		    }
		]
    },
    resolve: {
		alias: {
			jquery: path.resolve(ROOT_PATH, 'app/assets/js/libs/jquery/jquery.min.js'),
			app: path.resolve(ROOT_PATH, 'app/components/App/App.js')
		}
    },
    plugins: [
    	//Common Chunk
    	new CommonsChunkPlugin('app', 'app.js'),
    	// new CommonsChunkPlugin('header-main.js', ['header','main']),
    	
		//html
		new HtmlWebpackPlugin({
			title: 'index page',
			template: path.resolve(ROOT_PATH, 'app/tmpl/index.html'),
			inject: 'body',
			filename: 'index.html', //change it to '../index.html' if you want to test on browserSync model.
			hash: false,
			chunks: ['app']
		}),


    	ProvidePlugin
    ]
}

/* =============================================================
 *  dev
 * ============================================================ */
if(TARGET === 'dev') {
	module.exports = merge(common, {
    	output: {
	        path: path.resolve(BUILD_PATH)
	    },
    	devtool: "source-map",
	    module: {
	    	loaders: [
				//jsx
				{
					test: /\.jsx?$/,
	      			loaders: ['react-hot', 'babel'],
	      			include: APP_PATH
				},
	    		//sass
				{
			    	test: /\.scss$/,
			    	loader: 'style!css?sourceMap!sass?sourceMap!autoprefixer-loader',
			    	// loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
			    	include: APP_PATH
			    }
	    	]
	    },
	    plugins: [
			CssExtractPlugin
    	]
  	});
}


/* =============================================================
 *  browser sync
 * ============================================================ */
if(TARGET === 'browsersync') {
	module.exports = merge(common, {
    	output: {
	        path: path.resolve(ROOT_PATH, 'build/assets/'),
	        publicPath: 'assets/'
	    },
    	// devtool: "source-map",
	    module: {
	    	loaders: [
	    		//sass
				{
			    	test: /\.scss$/,
			    	// loader: 'style!css?sourceMap!sass?sourceMap!autoprefixer-loader',
			    	loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
			    	include: APP_PATH
			    }
	    	]
	    },
	    plugins: [
			CssExtractPlugin,
	    	BrowserSyncPlugin
    	]
  	});
}


/* =============================================================
 *  deploy
 * ============================================================ */
if (TARGET === 'deploy') {
	module.exports = merge(common, {
    	output: {
	        path: path.resolve(ROOT_PATH, 'dist/assets/'),
	        publicPath: 'assets/'
	    },
	    module: {
	    	loaders: [
	    		//sass
				{
			    	test: /\.scss$/,
			    	// loader: 'style!css!sass!autoprefixer-loader',
			    	loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader"),
			    	include: APP_PATH
			    }
	    	]
	    },
	    plugins: [
			UglifyJsPlugin,
			CssExtractPlugin
    	]
  	});
}