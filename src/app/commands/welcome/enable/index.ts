import { MessageFlags } from "mjx-client";
import { SlashCommandSubcommandBuilder } from "mjx-client"
import type { Subcommand } from "mjx-client"
import { setWelcomeEnabled } from "../../../../db/welcome.js";

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("enabled")
        .setDescription("Decide if you want to enable or disable welcome messages!")
        .addBooleanOption(option =>
            option.setName("enabled")
            .setDescription("True or False")
            .setRequired(true)
        ),
    async execute(interaction) {
        const isEnabled = (await interaction.options.getBoolean("enabled")) === true
        
        await setWelcomeEnabled(interaction.guildId!, isEnabled)

        const content = isEnabled && "Welcome system is now enabled! Make sure you have the welcome channel set for it to work!" || "Welcome system was disabled."

        await interaction.reply({content: content, flags: MessageFlags.Ephemeral})
    }
} satisfies Subcommand;