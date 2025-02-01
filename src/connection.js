import dotenv from "dotenv";
// const { Pool } = require("pg");
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log("Connected to database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

// module.exports = pool;
export { pool, connectToDb };
