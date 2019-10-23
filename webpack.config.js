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
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
	},

	plugins: [
        /*new HtmlWebpackPlugin({
			template: "./example/index.html"
		}),*/
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: false //压缩空格
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: false //压缩空格
            }
        }),
		new HtmlWebpackPlugin({
			filename: 'example/table/tableinit/tableinit.html',
			template: './example/table/tableinit/tableinit.html',
			chunks: ['index'],
			minify: {
				collapseWhitespace: false //压缩空格
			}
		}),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
		}),
        /*new CopyWebpackPlugin([
            {
                from : 'example',
                to   : '../example',
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
							publicPath: '../image',
                            outputPath: 'image',
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
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer") /*在这里添加*/
                            ]
                        }
                    },
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
    //devtool: 'eval',//SourceMap 功能
    //devtool: 'source-map',//SourceMap 功能
	/*devServer: {
        //contentBase: '../dist',
		open: true,
		hot: true,
        inline: true,
		hotOnly: true,
		port: 9001
	}*/
	devServer: {
        historyApiFallback :{
            rewrites:[
                {from:'/',to:'/example/table/tableinit/tableinit.html'}
            ]
        },
		open: true,
		port: 9001
	}
};
