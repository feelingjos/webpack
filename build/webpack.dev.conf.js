const webpack = require('webpack')

module.exports = {
    devtool: 'eval',//SourceMap 功能
    devServer: {
        open: true,
        hot: true,
        hotOnly: true,
        port: 9001
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),//热部署 刷新
        new webpack.NamedModulesPlugin() //打印日志
    ]
}