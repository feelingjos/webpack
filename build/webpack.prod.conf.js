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
                            publicPath: '',
                            outputPath: '../fonticon',
                            useRelativePath: false
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
};
