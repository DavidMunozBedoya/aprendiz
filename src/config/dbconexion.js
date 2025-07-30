import mysql from "mysql2/promise";

/* const dbconn = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_BASE,
  password: process.env.DB_PWD,
  waitForConnections: true,
  connectionLimit: 10,   // se puede ajustar la carga
  queueLimit: 0,
}); */

const dbconn = await mysql.createConnection({
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

export default dbconn;
