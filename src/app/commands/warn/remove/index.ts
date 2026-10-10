import { SlashCommandSubcommandBuilder, MessageFlags } from "mjx-client";
import type { Subcommand } from "mjx-client";
import { removeWarning } from "../../../../db/moderations.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove a warning by its id(number)")
        .addIntegerOption(option =>
            option.setName("number")
            .setDescription("The warning number/id, shows in the warn list.")
            .setMinValue(1)
            .setRequired(true)
        ),
    async execute(interaction) {
        const number = interaction.options.getInteger("number", true);
        const removed = await removeWarning(interaction.guildId!, number)

        const content = removed ? `Warning #${number} was removed.` : `There is no warning #${number}`
        await interaction.reply({ content: content, flags: MessageFlags.Ephemeral });
    }
} satisfies Subcommand