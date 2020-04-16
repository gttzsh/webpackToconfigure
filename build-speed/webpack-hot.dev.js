const path = require('path')
const webpack = require('webpack')
const webpackCommonConf = require('./webpack.common.js')
const { smart } = require('webpack-merge') //将webpack.commom.js文件引入 用smart
const { srcPath, distPath } = require('./paths')
//开启热更新
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

module.exports = smart(webpackCommonConf, {
    mode: 'development',
    entry: {
        // index: path.join(srcPath, 'index.js'),
        index: [
            'webpack-dev-server/client?http://localhost:8080/',
            'webpack/hot/dev-server',
            path.join(srcPath, 'index.js')
        ]
    },
    module: {
        rules: [
            {
              //处理es6加cacheDirectory 若代码没改，则使用缓存
              test: /\.js$/,
              loader: ['babel-loader?cacheDirectory'], //开启缓存
              include: srcPath //明确范围
            },
            // 直接引入图片 url
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            },
            //加
            {
              test: /\.css$/,
              //loader执行顺序： 从后往前   postcss-loader 做浏览器兼容
              loader: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
              test: /\.less$/,
              loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'development'
            ENV: JSON.stringify('development')
        })
    ],
    devServer: { //安装 webpack-dev-server 启动本地服务
        port: 8080,
        host: '0.0.0.0',
        historyApiFallback: true,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        open: true,  // 自动打开浏览器
        compress: true // 启动 gzip 压缩
        hot: true,

        // 设置代理 怎么跨域请求其他接口
        proxy: {
            // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
            '/api': 'http://localhost:3000',

            // 将本地 /api2/xxx 代理到 localhost:3000/xxx
            '/api2': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '/api2': ''
                }
            }
        }
    }
})
