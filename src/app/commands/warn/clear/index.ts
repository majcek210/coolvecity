import { SlashCommandSubcommandBuilder, MessageFlags } from "mjx-client";
import type { Subcommand } from "mjx-client";
import { clearWarnings } from "../../../../db/moderations.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear all of the member's warnings.")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("The member to clear.")
            .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user", true);
        const removed = await clearWarnings(interaction.guildId!, user.id);

        await interaction.reply({
            content: `Removed ${removed} warning(s) from ${user}`,
            flags: MessageFlags.Ephemeral,
            allowedMentions: { parse: []}
        })
    }
} satisfies Subcommand