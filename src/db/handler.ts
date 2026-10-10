import { dbConfig } from "./connection.js";
import mariadb from "mariadb"
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import logger  from "../utils/logger.js"

const migrationsDir = fileURLToPath(
    new URL("./migrations", import.meta.url)
)

export async function runMigrations() {
    const connection = await mariadb.createConnection({ ...dbConfig, multipleStatements: true });

    

    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        const files = (await readdir(migrationsDir))
            .filter(file => file.endsWith(".sql"))
            .sort()
        
        for (const file of files) {
            const existing = await connection.query(
                "SELECT id FROM schema_migrations WHERE name = ?",
                [file]
            );

            if (existing.length > 0) {
                logger.log(`Migration ${file} already executed, skipping.`);
                continue;
            }
            logger.log(`Executing migration ${file}...`);
            const sql = await readFile(path.join(migrationsDir, file), "utf-8")
            await connection.query(sql)
            await connection.query(
                "INSERT INTO schema_migrations (name) VALUES (?)",
                [file]
            );
        }
    } finally {
        await connection.end()
    }
}