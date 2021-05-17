// const test = require('./api/test.ts')
// // import fs from 'fs'
// // import path from 'path'
// // const express = require('express')
// const app = express()

// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'content-type')
//   res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')

//   if (req.method.toLowerCase() === 'options') {
//     res.send(200)
//   } else {
//     next()
//   }
// })

// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

// app.use('/api/test', test)
// app.listen(3306)
// console.log('success listen at port: 3306......')

const mysql = require('mysql')
const db = require('./db.ts')

const connection = mysql.createConnection(db.mysql)
connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error
  console.log('The solution is: ', results[0].solution)
})
