import type { GuildMember, User } from "mjx-client";


// we check here so we can acualy do actions on the user
export function checkTarget(moderator: GuildMember, user: User, target: GuildMember | null, ignoreBots?: boolean): string | null {
    if (user.id === moderator.id) return "You can't do that to yourself!";
    if (!ignoreBots && user.bot) return "You can't do that to a bot.";
    if (!target) return null;

    if (target.id === target.guild.ownerId) return "You can't do that to the server owner!";

    if (moderator.id !== moderator.guild.ownerId
        && target.roles.highest.comparePositionTo(moderator.roles.highest) >= 0) {
            return "That member's highest role is the same as or above yours!";
        }
    return null;
}

export async function notifyUser(user: User, content: string): Promise<boolean> {
    try {
        await user.send(content);
        return true;
    } catch {
        return false
    }
}