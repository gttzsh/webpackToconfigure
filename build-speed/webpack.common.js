const path = require('path')
const { srcPath, distPath } = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  //一个入口js文件
   entry: path.join(srcPath, 'index'),
   module: {
     rules: [
       //只留处理js
       
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
}
