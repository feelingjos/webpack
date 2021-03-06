const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

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
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.scss|\.sass$/,
                use: [
                    "style-loader",
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
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true
                }
            })
        ],
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
    devServer: {
        open: true,
        openPage:'example/table/tableinit/tablecss.html',
        port: 9002,
        host: '0.0.0.0',
        watchContentBase   : true,
        disableHostCheck   : true, // [1]
        overlay            : true,
        useLocalIp         : true,
        stats: {
            assets     : true,
            children   : false,
            chunks     : false,
            hash       : false,
            modules    : false,
            publicPath : false,
            timings    : true,
            version    : false,
            warnings   : true,
            colors     : true,
        },
    }

};
