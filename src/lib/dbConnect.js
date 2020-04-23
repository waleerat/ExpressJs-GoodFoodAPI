const { Pool } = require('pg')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'development.env' })
} 
let connectionString = 'postgres://postgres:' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME;
 
const pgPool = new Pool({
  connectionString: connectionString,
}) 

module.exports = pgPool;