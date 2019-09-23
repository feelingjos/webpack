const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlInlinkChunkPlugin = require('html-webpack-inline-chunk-plugin')

module.exports = {
	mode: 'development',

	entry: {
		index: './index.js'/*,
		indexts: './src/index.ts'*/
	},

	output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist')
	},

	plugins: [
		new webpack.ProgressPlugin(),
		/*new HtmlInlinkChunkPlugin({
			inlineChunks: ['manifest']
		}),*/
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			chunks: ['index'],//指定入口插入
			minify: {
				collapseWhitespace: false //压缩空格
			}
		}),
		new ExtractTextWebpackPlugin({
			filename: '[name].min.css'
		}),
		new webpack.HotModuleReplacementPlugin(),//热部署 刷新
		new webpack.NamedModulesPlugin() //打印日志
		/*,
	    new webpack.optimize.CommonsChunkPlugin({
			name: 'common', //公共代码打包
			minChunks: 2   //执行2次后再打包
		})*/
	],

	module: {
		rules: [
			{
				//test: /.(js|jsx)$/,
				test: /\.js$/,
                //test: /\.m?js$/,
				//include: [],
				//loaders: ['babel-loader'],
                use: {
                    loader: 'babel-loader'/*
                    options: {
                        plugins: ['syntax-dynamic-import'],
                    }*/
                },
				/*{
					loader: 'eslint-loader',
                    options: {
						formatter: require('eslint-friendly-formatter')
					}
                },*/
                //include: path.join(__dirname, 'src'),
                exclude: '/node_modules/' /*,
                options: {
                    plugins: ['syntax-dynamic-import'],

                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false
                            }
                        ]
                    ]
                }*/
			},
			{
				test: /\.tsx?$/,
				use:{
					loader: 'ts-loader'
				}
			},
			{
				test: /\.css/,
				use: [
					{
                        loader: 'style-loader',
                        options: {
                        	//insertInto: '#body',
							singleton: true,
							transform : './css.transform.js'
						}
                    },
					{
						loader: 'css-loader',
                        options: {
							//minimize: true,//压缩
							modules: true//,//模块引用标签样式
							//localIdentName: '[path][name]_[local]_[hash:base64:5]'//生成名称控制
						}
                    },
                    {
                        loader: 'postcss-loader',
                        options:{
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')()
                            ]
                        }
                    }
					/*{
                        loader: 'style-loader/url'
                    },
					{
						loader: 'file-loader'
					}*/
					/*{
                        loader: 'style-loader/useable'
                    },
					{
						loader: 'css-loader'
					}*/
				]
			},
			{
				test: /\.less$/,
				use: ExtractTextWebpackPlugin.extract({
					fallback:{
                        loader: 'style-loader',
                        options: {
                            singleton: true,
                            transform : './css.transform.js'
                        }
                    },
					use:[
                        {
                            loader: 'css-loader',
                            options: {
                                //minimize: true,//压缩
                                //modules: true//模块引用标签样式
                            }
                        },
						{
					 		loader: 'postcss-loader',
							options:{
								ident: 'postcss',
								plugins: [
									//require('autoprefixer')(),
									/*require('postcss-sprites')({
										spritePath: 'dist/sprites',
										retina: true
									}),//雪碧图*/
									require('postcss-cssnext')()//新语法
								]
							}
						},
                        {
                            loader: 'less-loader'
                        }
                    ]
				})
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					/*{
                        loader: 'file-loader',
                        options: {
                        	publicPath: '',
                        	outputPath: './image',
                        	useRelativePath: true
						}
                    }*/
					{
                        loader: 'url-loader',
                        /*options: {
                        	limit: 1000
						}*/
                    },
					{
						loader: 'img-loader',
                        options: {
							pngquant:{
								quality: 10
							},
                            plugins: [
                                /*require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                })*/
                            ]
						}
                    }
				]
			},
			{
				test: /\.(eot|woff2|woff|ttf|svg)/,
				use: [
					{
                        loader: "url-loader",
                        options: {
                        	name: '[name]-[hash:5].[ext]',
                            publicPath: '',
                            outputPath: './image',
                            useRelativePath: true//不同引用生成不同路径html/css
						}
                    }
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
			//chunks: 'manifest',
			minChunks: 1,
			minSize: 30000,
			name: true
			//name: 'manifest'
		}
	},
    devtool: 'eval',//SourceMap 功能
	devServer: {
		open: true,
		/*proxy: {
			'api': {
				target: 'https://m.weibo.cn',
				changeOrigin: true,
				logLevel: 'debug',
				pathRewrite: {
				    '^/comments': '/api/comments'
				},
				headers: {
				    'Cookie': 'asdfasdf....'
				}
			}
		},代理接口*/
		//historyApiFallback: true, 任意路径不会报错
		/*historyApiFallback: {
			rewrites: [
				{
                    from: '/pages/a',//支持正则
					//to: '/pages/a.html'
					to: function(context){
                    	return "";
                    }
				}
			]
		},*/
		hot: true,
		hotOnly: true,
		port: 9001
		//inline: false//页面进度条
	}
};
