const mysql = require('mysql')
require('dotenv').config()

const conn = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

module.exports = conn