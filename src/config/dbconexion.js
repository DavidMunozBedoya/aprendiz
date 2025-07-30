import mysql from "mysql2/promise";

const dbconn = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_BASE,
  password: process.env.DB_PWD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/* try {
  await dbconn.connect();
} catch (err) {
  console.log(err);
} */

export default dbconn;
