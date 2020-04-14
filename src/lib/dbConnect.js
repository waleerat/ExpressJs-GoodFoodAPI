const { Pool } = require('pg')
const connectionString = 'postgres://postgres:deknoi3004@localhost:3004/GoodFood'

const pgPool = new Pool({
  connectionString: connectionString,
}) 

module.exports = pgPool;