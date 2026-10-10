import { db } from "./connection.js"

export async function ensureUser(userId: string, username:string) {
    await db.query(`
            INSERT INTO users (id, username) VALUES (?,?)
            ON DUPLICATE KEY UPDATE username = VALUES(username)
        `,
        [userId, username]
        
    )
}