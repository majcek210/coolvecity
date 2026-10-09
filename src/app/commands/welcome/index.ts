import { guildOnly, PermissionFlagsBits, requirePermissions, type CommandGroup} from "mjx-client";

export default { 
    description: "A group of commands thats used to manage welcome messages.",
    guards: [ guildOnly, requirePermissions(PermissionFlagsBits.ManageGuild)]
} satisfies CommandGroup;