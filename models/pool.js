const mysql_default = require('mysql');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
const util = require('util');

const pool = mysql_default.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database:  DB_NAME
});


pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        throw new Error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        throw new Error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        throw new Error('Database connection was refused.')
      }
    }
  
    if (connection) connection.release()
    console.log("Pool is ok!")
    return
  })

pool.query = util.promisify(pool.query)

module.exports = pool;