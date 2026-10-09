import { db } from "./connection.js";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const migrationsDir = fileURLToPath(
    new URL("./migrations", import.meta.url)
)

export async function runMigrations() {
    const connection = await db.getConnection();

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

            if (existing.lenght > 0) {
                console.log(`Migration ${file} already executed, skipping.`);
                continue;
            }
            console.log(`Executing migration ${file}...`);
        }
    } catch (error) {
        console.error("Error running migrations:", error);
    }
}