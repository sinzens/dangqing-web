const models = require('../db.ts')
const express = require('express')
const mysql = require('mysql')

const router = express.Router()
// const $sql = require('../sqlMap')

const connection = mysql.createConnection(models.mysql)
connection.connect()

const jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1', msg: '操作失败'
    })
  } else {
    res.json(
      ret
    )
  }
}

router.post('/addStu', (req, res) => {
  // const sql = $sql.Stu.add
  // const params = req.body
  // console.log('添加', params)
  // conn.query(sql, [params.stu_name, params.stu_sex, params.stu_college, params.stu_class], function (err, result) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   if (result) {
  //     jsonWrite(res, result)
  //   }
  // })
})

router.get('/showStu', (req, res) => {
  // const sql = $sql.Stu.show
  // const params = req.body
  // console.log(params)
  // conn.query(sql, [params.stu_Id, params.stu_name, params.stu_sex, params.stu_college, params.stu_class], function (err, result) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   if (result) {
  //     jsonWrite(res, result)
  //   }
  // })
})

router.post('/delStu', (req, res) => {
  // const sql = $sql.Stu.del
  // const params = req.body
  // console.log('删除', params)
  // conn.query(sql, [params.stu_Id], function (err, result) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   if (result) {
  //     jsonWrite(res, result)
  //   }
  // })
})

router.post('/updateStu', (req, res) => {
  // const sql = $sql.Stu.update
  // const params = req.body
  // console.log('修改', params)
  // conn.query(sql, [params.stu_name, params.stu_sex, params.stu_college, params.stu_class, params.stu_Id], function (err, result) {
  //   if (err) {
  //     console.log(err)
  //   }
  //   if (result) {
  //     jsonWrite(res, result)
  //   }
  // })
})

module.exports = router
