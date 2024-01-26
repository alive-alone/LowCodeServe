const mysql = require('mysql')

const BASE_URL = '127.0.0.1'
const SERVER_URL = '47.115.206.105'
// const SERVER_URL = '127.0.0.1'
const PORT = 8989
const db = mysql.createPool({
  host: BASE_URL,
  user: 'root',
  password: 'WzwRoot@.',
  database: 'low_code'
})
// const db = mysql.createPool({
//   host: BASE_URL,
//   user: 'root',
//   password: 'Root',
//   database: 'low_code'
// })

module.exports = {
  db,
  BASE_URL,
  SERVER_URL,
  PORT,
}