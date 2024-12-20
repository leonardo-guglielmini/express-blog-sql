const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'db_blog',
})

conn.connect((err) => {
    if (err) throw err
    console.log(`Connected to DB`)
})

module.exports = conn