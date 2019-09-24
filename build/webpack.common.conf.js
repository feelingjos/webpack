const productionConfig = require('./webpack.prod.conf')
const developmentConfig = require('./webpack.dev.conf')
const path = require('path')

const merge = require('webpack-merge')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const generateConfig = env => {

    const extractLess =  new ExtractTextWebpackPlugin({
        filename: '[name].min.css'
    })

    const scriptLoader = [
             'babel-loader'
        ].concat(env === 'prouction'
            ? []
            : []
            //: ['eslint-loader']
    )

    const cssLoaders =  [{
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
                    require('postcss-cssnext')()//新语法
                ]
            }
        },
        {
            loader: 'less-loader'
        }]

    const styleLoader = env = 'production' ?  extractLess.extract({
        fallback :'style-loader',
        use: cssLoaders
    }):[{
        loader: 'style-loader'
    }].concat(cssLoaders)

    const fileLoader = env === 'development' ?
        [{
            loader: 'file-loader',
            options: {
                name:'[name]-[hash:5].[ext]',
                outputPath: 'assets/imgs/'
            }
        }]
        : [{
            loader: 'url-loader',
            options: {
                name: '[name]-[hash:5].[ext]',
                limit: 1000,
                outputPath: 'assets/imgs/'
            }
        }]

    return {
        entry: {
            index: './index.js'/*,
		indexts: './src/index.ts'*/
        },

        output: {
            filename: '[name].[hash].js',
            publicPath: '',
            path: path.resolve(__dirname, '../dist')
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: scriptLoader,
                    exclude: '/node_modules/'
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
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
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
                    ]
                },
                {
                    test: /\.less$/,
                    use: styleLoader
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: fileLoader.concat(
                        env === 'production'
                        ? {
                            loader: 'img-loader',
                            options: {
                                pngquant:{
                                    quality: 80
                                }
                            }
                        }
                        : []
                    )
                },
                {
                    test: /\.(eot|woff2|woff|ttf|svg)/,
                    use: fileLoader
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
        plugins: [
            extractLess,
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.html',
            })
        ]
    }
}

module.exports = env => {
    let config = env = 'production'
        ? productionConfig
        : developmentConfig

    return merge(generateConfig(env),config)
}
