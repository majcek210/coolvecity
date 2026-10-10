import mariadb from "mariadb";
import env from "../utils/env.js";

export const dbConfig = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,

    ssl: env.DB_SSL
};

export const db = mariadb.createPool(dbConfig);