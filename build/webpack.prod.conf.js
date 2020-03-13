const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        index: './index.js',
    },

    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: false //压缩空格
            }
        }),
        new HtmlWebpackPlugin({
            //filename: 'example/table/tableinit/tableinit.html',
            //template: './example/table/tableinit/tableinit.html',
            filename: 'example/table/tableinit/tablecss.html',
            template: './example/table/tableinit/tablecss.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: false //压缩空格
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'example/table/tableinit/tableconfig.html',
            template: './example/table/tableinit/tableconfig.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: false //压缩空格
            }
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            parallel: 4,
            uglifyOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        }),
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
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: "../fonts/",
                            outputPath: "fonts/",
                            /*publicPath: '',
                            outputPath: '../fonticon',*/
                            useRelativePath: true
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
    devtool: 'source-map',
    optimization: {
        /*minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true
                }
            })
        ],*/
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
};
