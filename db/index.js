const mysql = require('mysql')

const BASE_URL = '127.0.0.1'
const PORT = 3000
const db = mysql.createPool({
  host: BASE_URL,
  user: 'root',
  password: 'Root',
  database: 'low_code'
})

module.exports = {
  db,
  BASE_URL,
  PORT,
}