// 导入 MongoDB 模块
var mongo = require('mongodb')

// 连接数据库的 URL
var url = 'mongodb://127.0.0.1:27017/hr'

// 获取(连接 MongoDB)客户端
var client = mongo.MongoClient

// 连接并创建一个名为 hr 的数据库
client.connect(url, (err, db) => {
  if (err) throw err

  // 创建集合
  db.createCollection('customer',(err,res)=>{
    if (err) throw err

    console.log('集合 customer 创建成功')
    db.close() // 关闭数据库
  })
})