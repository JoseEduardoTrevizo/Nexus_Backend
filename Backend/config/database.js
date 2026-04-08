import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 10,
  idleTimeout: 60000, // 60 segundos
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado a MySQL - DirectrorioDB");
    connection.release();
  } catch (error) {
    console.error("Error conectando a MySQL:", error.message);
  }
};

testConnection();
export default pool;
