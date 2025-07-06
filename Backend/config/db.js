const { Pool } = require("pg");
require("dotenv").config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD || ""),
  database: process.env.DB_NAME || "Travel_agency",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  ssl: {
    rejectUnauthorized: false, // important for Render!
  },
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.connect((err) => {
  if (err) console.error("Database connection error:", err.stack);
  else console.log("Database connected successfully");
});

module.exports = pool;
