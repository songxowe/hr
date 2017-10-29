var express = require('express')
var path = require('path')
var router = require('./approuter.js')

var app = express()

// Add headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// 设置静态资源路径 
var staticResources = express.static(path.join(__dirname, 'public'))
// 使用静态资源
app.use(staticResources)
// 使用路由设置
app.use('/', router)

app.listen(3000, () => {
  console.log('Nodejs Server running at 3000')
})