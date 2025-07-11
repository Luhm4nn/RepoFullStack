import { createPool } from "mysql2/promise.js";

export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "tp-dsw",
});
