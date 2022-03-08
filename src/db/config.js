const mysql = require("mysql");
require('dotenv').config();

const conn = mysql.createPool({
  connectionLimit: 10,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DATABASE,
  host: process.env.HOST
});

module.exports = conn;