import { guildOnly, PermissionFlagsBits, requirePermissions, type CommandGroup } from 'mjx-client';

export default {
    description: "Warn a user in the server.",
    guards: [guildOnly, requirePermissions(PermissionFlagsBits.ModerateMembers)]
} satisfies CommandGroup;