const merge = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseConfig = {

    entry: {
        react: 'react'
    },

    output: {
        path: path.resolve(__dirname,"../dist"),
        filename: 'js/[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: "initial",         // 必须三选一： "initial" | "all"(默认就是all) | "async"
            minSize: 0,                // 最小尺寸，默认0
            minChunks: 1,              // 最小 chunk ，默认1
            maxAsyncRequests: 1,       // 最大异步请求数， 默认1
            maxInitialRequests: 1,    // 最大初始化请求书，默认1
            name: () => {},              // 名称，此选项课接收 function
            cacheGroups: {                 // 这里开始设置缓存的 chunks
                priority: "0",                // 缓存组优先级 false | object |
                vendor: {                   // key 为entry中定义的 入口名称
                    chunks: "initial",        // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                    test: /react/,     // 正则规则验证，如果符合就提取 chunk
                    name: "react",           // 要缓存的 分隔出来的 chunk 名称
                    minSize: 0,
                    minChunks: 1,
                    enforce: true,
                    maxAsyncRequests: 1,       // 最大异步请求数， 默认1
                    maxInitialRequests: 1,    // 最大初始化请求书，默认1
                    reuseExistingChunk: true   // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    }
}

const generatePage = function({
    title = '',
    entry = '',
    template = './src/html/index.html',
    name = '',
    chunks = []
} = {}){
    return {
        entry,
        plugins: [
            new HtmlWebpackPlugin({
                chunks,
                template,
                title,
                filename: name + '.html'
            })
        ]
    }
}

const pages = [
    generatePage({
        title: 'paeg A',
        entry : {
            a: './src/html/pages/a'
        },
        name: 'a',
        chunks: [
            'react',
            'a'
        ]
    }),
    generatePage({
        title: 'paeg B',
        entry : {
            b: './src/html/pages/b'
        },
        name: 'b',
        chunks: [
            'react',
            'b'
        ]
    }),
    generatePage({
        title: 'paeg C',
        entry : {
            c: './src/html/pages/c'
        },
        name: 'c',
        chunks: [
            'react',
            'c'
        ]
    })
]

module.exports = merge([baseConfig].concat(pages))

