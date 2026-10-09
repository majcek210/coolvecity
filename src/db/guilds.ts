import { db } from "./connection.js"

export async function ensureGuild(guildId: string) {
    await db.query("INSERT IGNORE INTO guilds (id) VALUES (?)", [guildId]);
}