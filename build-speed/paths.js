//常用的文件夹路径
const path = require('path')
const srcPath = path.join(__dirname, '..', 'src')
const distPath = path.join(__dirname, '..', 'dist')
module.exports = {
  srcPath,
  distPath
}
