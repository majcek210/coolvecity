import maridb from "mariadb";
import env from "../utils/env.js";

export const db = maridb.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,

    ssl: env.DB_SSL 
});