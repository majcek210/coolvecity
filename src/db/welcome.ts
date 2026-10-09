import { db } from "./connection.js"
import { ensureGuild } from "./guilds.js"

export const DEFAULT_WELCOME_MESSAGE = "Welcome {user} to the {serv}. Read the rules and have fun!"

export interface WelcomeSettings {
    enabled: boolean;
    channelId: string | null;
    message: string;
}

export async function getWelcomeSettings(guildId: string): Promise<WelcomeSettings> {
    const rows = await db.query(
        "SELECT enabled, channel_id, message FROM welcome_settings WHERE guild_id = ?",
        [guildId]
    );
    const row = rows[0]

    return {
        enabled: Boolean(row?.enabled),
        channelId: row?.channel_id ?? null,
        message: row?.message ?? DEFAULT_WELCOME_MESSAGE

    }
}

async function setWelcomeColumn(guildId: string, column: "enabled" | "channel_id" | "message", value: string  | boolean) {
    await ensureGuild(guildId);
    await db.query(
        `INSERT INTO welcome_settings (guild_id, ${column}) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE ${column} = VALUES(${column})`,
        [guildId, value]
    )
}

export const setWelcomeEnabled = (guildId:string, enabled: boolean) => setWelcomeColumn(guildId, "enabled", enabled);

export const setWelcomeChannel = (guildId: string, channelId: string) => setWelcomeColumn(guildId, "channel_id", channelId)

export const setWelcomeMessage = (guildId: string, message: string ) => setWelcomeColumn(guildId, "message", message);
