import mysql from "mysql"


// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'your_db_user',
//   password: 'your_db_password',
//   database: 'your_database_name',
// });


export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Jolakoski123",
    database:"projectsystems3",
})

 