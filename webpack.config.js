const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: 'development',
	entry: {
		index: './index.js',
	},

	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist/js')
	},

	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			filename: '../example/index.html',
			template: 'example/index.html',
			chunks: ['index'],
			minify: {
				collapseWhitespace: false //压缩空格
			}
		}),
        new MiniCssExtractPlugin({
            filename: '../css/[name].[chunkhash].css'
		}),
		/*new CopyWebpackPlugin([
			{
			    from: 'example',
			    to: ''
		    },
			{
				from: 'src/scripts',
				to: 'js'
			}
		]),*/
		new webpack.HotModuleReplacementPlugin(),//热部署 刷新
		new webpack.NamedModulesPlugin() //打印日志
	],

	module: {
		rules: [
			{
				test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules/'
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					/*{
                        loader: 'url-loader',
                    },*/
					{
						loader: 'file-loader',
                        options: {
                            publicPath: '',
                            outputPath: '../image',
                            useRelativePath: false
                        }
					},
					{
						loader: 'img-loader',
                        options: {
							pngquant:{
								quality: 10
							},
						}
                    }
				]
			},
			{
				test: /\.(eot|woff2|woff|ttf|svg)/,
				use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: '',
                            outputPath: '../fonticon',
                            useRelativePath: false
                        }
                    }
					/*{
                        loader: "url-loader",
                        options: {
                        	name: '[name]-[hash:5].[ext]',
                            publicPath: '',
                            outputPath: '../static',
                            useRelativePath: false//不同引用生成不同路径html/css
						}
                    }*/
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
                        options: {
							attrs: ['img:src']
						}
                    }
				]
			},
            {
                test: /\.scss|\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
                ]
            }
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},
			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},
    devtool: 'eval',//SourceMap 功能
	devServer: {
		open: true,
		hot: true,
		hotOnly: true,
		port: 9001
	}
};
