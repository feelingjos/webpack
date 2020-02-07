const HtmlWebpackPlugin = require('html-webpack-plugin')

var index = new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './index.html',
    chunks: ['index'],
    minify: {
        collapseWhitespace: false //压缩空格
    }
})

var tableinit = new HtmlWebpackPlugin({
    filename: 'example/table/tableinit/tableinit.html',
    template: './example/table/tableinit/tableinit.html',
    chunks: ['index'],
    minify: {
        collapseWhitespace: false //压缩空格
    }
})

var tableconfig = new HtmlWebpackPlugin({
        filename: 'example/table/tableinit/tableconfig.html',
        template: './example/table/tableinit/tableconfig.html',
        chunks: ['index'],
        minify: {
            collapseWhitespace: false //压缩空格
        }
    })

var tablecss = new HtmlWebpackPlugin({
        filename: 'example/table/tableinit/tablecss.html',
        template: './example/table/tableinit/tablecss.html',
        chunks: ['index'],
        minify: {
            collapseWhitespace: false //压缩空格
        }
    })

export {
    index,
    tableconfig,
    tableinit
}