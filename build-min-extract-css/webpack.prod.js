const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
//抽离css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//压缩css文件
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
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
  //多个入口
  //output: {
  //   filename: '[name].[contentHash:8].js', name即多入口的名字
  //   path: distPath
  // },
  module: {
    rules: [
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
    })
  ],
  //抽离之后要压缩
  optimization: {
    //压缩css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  }
})
