var join = require('path').join

module.exports = {
	entry:join(__dirname,'index.js'),
	output:{
		path:'./dist',
		publicPath:'dist/',
		filename:'bundle.js'
	},
	module:{
		loaders:[
			{
				test:/\.js$/,
				loader:'babel-loader',
				exclude:/node_modules/,
				query:{
					"presets":["es2015"],
					"plugins":["transform-runtime"]
				}
			}
		]
	}
}