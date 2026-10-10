import { db } from "./connection.js"
import { ensureGuild } from "./guilds.js"
import { ensureUser } from "./users.js"



export interface Warning {
    number: number;
    moderatorId: string;
    reason: string | null;
    createdAt: Date;
}

interface UserRef {
    id: string;
    username: string;
}


const ER_DUP_ENTRY = 1062;
const ER_LOCK_DEADLOCK = 1213;

export async function addWarning(guildId: string, user: UserRef, moderator: UserRef, reason: string | null): Promise<number> {
    await ensureGuild(guildId);
    await ensureUser(user.id, user.username);
    await ensureUser(moderator.id, moderator.username);

    for (let attempt = 1; ; attempt++) {
        try {
            const result = await db.query(
                `INSERT INTO warnings (guild_id, user_id, moderator_id, reason, number)
                SELECT ?, ?, ?, ?, COALESCE(MAX(number), 0) + 1 FROM warnings WHERE guild_id = ?
                `,
                [guildId,user.id, moderator.id, reason, guildId]
            );
            const rows = await db.query("SELECT number FROM warnings WHERE id = ?", [result.insertId]);
            return rows[0].number;

        } catch (err: any) {
            const canRetry = err?.errno === ER_DUP_ENTRY || err?.errno === ER_LOCK_DEADLOCK;
            if (!canRetry || attempt >= 3) throw err;
        }
    }
}

export async function getWarnings(guildId: string, userId: string ): Promise<Warning[]> {
    const rows = await db.query(
        `SELECT number, moderator_id, reason, UNIX_TIMESTAMP(created_at) AS created_at FROM warnings
        WHERE guild_id = ? AND user_id = ?
        ORDER BY number DESC LIMIT 25
        `,
        [guildId, userId]
    );

    return rows.map((row: any ) => ({
        number: row.number,
        moderatorId: row.moderator_id,
        reason: row.reason,
        createdAt: new Date(Number(row.created_at)* 1000)
    }));
    
}

export async function countWarnings(guild: string, userId: string): Promise<number> {
    const rows = await db.query(
        "SELECT COUNT(*) AS total FROM warnings WHERE guild_id = ? AND user_id = ?",
        [guild, userId]
    );
    return Number(rows[0].total);
}

export async function removeWarning(guildId: string, number: number) : Promise<boolean> {
    const result = await db.query(
        "DELETE FROM warnings WHERE guild_id = ? AND number = ?",
        [guildId, number]
    );
    return result.affectedRows > 0;
}

export async function clearWarnings(guildId: string, userId: string): Promise<number> {
    const result = await db.query(
        "DELETE FROM warnings WHERE guild_id = ? AND user_id = ?",
        [guildId, userId]
    );
    return result.affectedRows;
}