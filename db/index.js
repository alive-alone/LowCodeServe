const mysql = require('mysql')

const db = mysql.createPool({
  host: '10.33.81.179',
  user: 'root',
  password: 'Root',
  database: 'project'
})

module.exports = db