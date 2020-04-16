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
       //只留处理js
       {
         //处理es6
         test: /\.js$/,
         loader: ['babel-loader'],
         include: srcPath
       },
       //处理vue 安插件 vue-loader
       //处理JSX 安@babel/preset-react
       //加.babelrc 
       {
         //处理vue
         test: /\.vue$/,
         loader: ['vue-loader'],
         include: srcPath
       }
     ]
   },
   //一个入口最终输出到index.html中
   plugins: [
     new HtmlWebpackPlugin({
       template: path.join(srcPath, 'index.html'),
       filename: 'index.html',
       chunks: ['index', 'vender', 'common']
     })
   ]

   // plugins: [
   //  //多个入口最终输出到index.html中
   //   new HtmlWebpackPlugin({
   //     template: path.join(srcPath, 'index.html'),
   //     filename: 'index.html',
   //     chunks表示该页面要引用 chunk 即上面的 index other
   //     chunks: ['index', 'vender', 'common'] 只引用index.js
   //   }),
   //    //多个入口最终输出到other.html中
   //   new HtmlWebpackPlugin({
   //     template: path.join(srcPath, 'other.html'),
   //     filename: 'other.html',
   //     chunks: ['other', 'vender', 'common']只引用index.js
   //   })
   //
   // ]
}
