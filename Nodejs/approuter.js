// 路由列表

var express = require('express')
var bodyParser = require('body-parser')
var mongo = require('mongodb')
var ObjectId = mongo.ObjectId
var router = express.Router()

// 当设置为 false 时,会使用 querystring 库解析 URL 编码的数据;
// 当设置为 true 时,会使用 qs 库解析 URL 编码的数据 (默认)
router.use(bodyParser.urlencoded({ extended: false }))

// ** Upload Image **********************************
var imgFileName = ''
var multer = require('multer')

// 设置云端存储的路径和文件名 cb=callback
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    // abc.png =>abc png     abc.xyz.png => abc xyz png
    var fileFormat = (file.originalname).split('.')
    // 重新设置图片名 avatar-1401.png
    imgFileName = file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]
    cb(null, imgFileName)
  }
})

// 上传图片后的路径 public/images/abc.png
var upload = multer({ storage: storage })

router.post('/profile', upload.single('avatar'), function (req, res, next) {
  if (req.file) {
    res.send({ msg: '图片上传成功', img_path: 'images/' + imgFileName })
  }
})

// ** Upload Image **********************************

// ** MongoDB **********************************

var url = 'mongodb://127.0.0.1:27017/hr'
var client = mongo.MongoClient

// 查询所有 接口|路由|请求
router.get('/listCustomer', (req, res) => {
  client.connect(url, (err, db) => {
    if (err) throw err

    // Chrome: http://127.0.0.1:3000/listCustomer
    /*db.collection('customer').find({}).toArray((err, result) => {
      if (err) throw err

      // 向客户端发送结果集
      res.send(result)
      db.close()
    })*/

    // Chrome: http://127.0.0.1:3000/listCustomer?page=1&rows=4 测试查询所有的接口
    // 分页显示文档 skip(跳过的条数) limit(一页显示条数)  
    var page = parseInt(req.query.page) //第几页 
    var rows = parseInt(req.query.rows) // 每页显示条数 
    var skip = (page - 1) * rows // 跳过指定的条数
    db.collection('customer').find().skip(skip).limit(rows).toArray((err, result) => {
      if (err) throw err

      // 向客户端发送结果集
      res.send(result)
      db.close()
    })
  })
})

// http://127.0.0.1:3000/findCustomerById?_id=xxx
// 根据 id 查询
router.post('/findCustomerById', (req, res) => {
  client.connect(url, (err, db) => {
    if (err) throw err

    var _id = ObjectId(req.body._id)
    db.collection('customer').find({ _id: _id }).toArray((err, result) => {
      if (err) throw err

      // 向客户端发送结果集
      res.send(result)
      db.close()
    })
  })
})

// http://127.0.0.1:3000/removeCustomer?_id=xxx
// 根据 id 删除
router.post('/removeCustomer', (req, res) => {
  client.connect(url, (err, db) => {
    if (err) throw err

    var _id = ObjectId(req.body._id)
    db.collection('customer').deleteOne({ _id: _id }, (err, result) => {
      if (err) throw err

      console.log("删除数据成功")
      // 向客户端发生结果
      res.send('ok')
      db.close()
    })
  })
})

// http://127.0.0.1:3000/modifyCustomer?_id=59f0370cff931e12a0407d37&name=zzzz&address=zzz&img_path=zzz
// 修改
router.post('/modifyCustomer', (req, res) => {
  client.connect(url, (err, db) => {
    if (err) throw err

    var _id = ObjectId(req.body._id)
    var where = { _id: _id }

    var values = { name: req.body.name, address: req.body.address, img_path: req.body.img_path }

    db.collection('customer').updateOne(where, values, (err, result) => {
      if (err) throw err

      console.log("修改数据成功")
      // 向客户端发生结果
      res.send('ok')
      db.close()
    })
  })
})

// 新增 接口|路由|请求
router.post('/addCustomer', (req, res) => {
  client.connect(url, (err, db) => {
    if (err) throw err

    var customer = { name: req.body.name, address: req.body.address, img_path: req.body.img_path }

    db.collection('customer').insertOne(customer, (err, result) => {
      if (err) throw err

      console.log("新增数据成功")
      // 向客户端发生结果
      res.send('ok')
      db.close()
    })

    /*
    var customers = [
      { name: 'Tom', address: 'NY', img_path: 'images/tom.jpg' },
      { name: 'Jack', address: 'LA', img_path: 'images/jack.jpg' },
      { name: 'Rose', address: 'CH', img_path: 'images/rose.jpg' },
    ]

    db.collection('customer').insertMany(customers, (err, res) => {
      if (err) throw err

      console.log("新增多条数据成功")
      db.close()
    })*/
  })
})

// ** MongoDB **********************************

module.exports = router
