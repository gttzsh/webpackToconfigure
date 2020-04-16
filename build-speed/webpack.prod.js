const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
//抽离css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//压缩css文件
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
//happypack 多进程打包
const HappyPack = require('happypack')
//多进程压缩 js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const webpackCommonConf = require('./webpack.common.js')
const { smart } = require('webpack-merge')///将webpack.commom.js文件引入 用smart
const { srcPath, distPath } = require('./paths')

module.exports = smart(webpackCommonConf, {
  mode: 'production',
  //一个入口
  output: {
    filename: 'bundle.[contentHash:8].js', //打包时，加上 hash,每次打包文件名不一致,如果文件没变，就命中缓存，运行会更快
    path: distPath
  },
  module: {
    //避免重复打包
    //本身就是打包好的，不需再打包
    noParse: [/react\.min\.js$/],
    rules: [
      //happypack多进程打包
      {
        test: /\.js$/,
        //把对 .js 的处理交给 id=babel 的happypack实例
        use: ['happypack/loader?id=babel'], //开启缓存
        include: srcPath //明确范围
      },
      //图片考虑 base64 编码
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            //小于 3kb 的图片用base64产出
            //否则 依然用file-loader 的形式，产出URL格式
            limit: 3 * 1024,

            //打包到img目录下
            outputPath: '/imgOut/',

            //设置图片的cdn 地址
            //publicPath: 'http://cdn.abc.com'
          }
        }
      },
      //抽离css
      {
        test: /\.css$/,
        loader: [
          MiniCssExtractPlugin.loader,//这里不再用style-loader
          'css-loader',
          'postcss-loader'
        ]
      },
      //抽离less
      {
        test: /\.less$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), //默认清空 output。path 文件夹
    new webpack.DefinePlugin({
      //window.ENV = production
      ENV:JSON.stringify('production')
    }),
    //抽离 css 文件
    new MiniCssExtractPlugin({
      filename: 'css/main.[contentHash:8].css'
    }),
    //避免引入无用模块
    new webpack.IgnorePlugin(/\.\/local/,/moment/)

    //HappyPack 多进程打包
    new HappyPack({
      //用唯一标识 id 代表 HappyPack
      id: 'babel',
      //如何处理 。js 文件，用法和 loader 配置一样
      loaders: ['babel-loader?cacheDirectory']
    }),
    //使用 ParallelUglifyPlugin 多进程压缩js
    new ParallelUglifyPlugin({
     // 传递给 UglifyJS 的参数
     // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
      uglifyJS: {
         output: {
             beautify: false, // 最紧凑的输出
             comments: false, // 删除所有的注释
          },
          compress: {
             // 删除所有的 `console` 语句，可以兼容ie浏览器
             drop_console: true,
             // 内嵌定义了但是只用到一次的变量
             collapse_vars: true,
             // 提取出出现多次但是没有定义成变量去引用的静态值
             reduce_vars: true,
          }
      }
    })
  ]



})
