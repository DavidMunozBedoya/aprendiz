import mysql from "mysql2/promise";

const dbconn = mysql.createPool({  // Sin await
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_BASE,
  password: process.env.DB_PWD,
  ssl: {
    rejectUnauthorized: false  // Para Clever Cloud
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


/* const dbconn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_BASE,
  password: process.env.DB_PWD,
});

try {
  await dbconn.connect();
} catch (err) {
  console.log(err);
}

console.log("DB conectada"); */

export default dbconn;
