const path = require('path')
const { srcPath, distPath } = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  //一个入口js文件
   entry: path.join(srcPath, 'index'),
   //多入口
   //entry: {
     //index: path.join(srcPath, 'index.js'),
     //other:path.join(srcPath, 'other.js')
   //}
   module: {
     rules: [
       {
         //处理es6
         test: /\.js$/,
         loader: ['babel-loader'],
         include: srcPath
       },
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
   //一个入口最终输出到index.html中
   plugins: [
     new HtmlWebpackPlugin({
       template: path.join(srcPath, 'index.html'),
       filename: 'index.html'
     })
   ]

   // plugins: [
   //  //多个入口最终输出到index.html中
   //   new HtmlWebpackPlugin({
   //     template: path.join(srcPath, 'index.html'),
   //     filename: 'index.html',
   //     chunks表示该页面要引用 chunk 即上面的 index other
   //     chunks: ['index'] 只引用index.js
   //   }),
   //    //多个入口最终输出到other.html中
   //   new HtmlWebpackPlugin({
   //     template: path.join(srcPath, 'other.html'),
   //     filename: 'other.html',
   //     chunks: ['other']只引用index.js
   //   })
   //
   // ]
}
