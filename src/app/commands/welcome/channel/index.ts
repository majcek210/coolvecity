import { SlashCommandSubcommandBuilder, ChannelType,MessageFlags } from "mjx-client";
import type { Subcommand } from "mjx-client";
import { setWelcomeChannel } from "../../../../db/welcome.js"
import { replyEmbed, embeds } from "../../../../utils/embedSets.js"

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("channel")
        .setDescription("Which channel to send the welcome message to.")
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription("The channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel", true);
        
        await setWelcomeChannel(interaction.guildId!, channel.id)

        await replyEmbed(
            interaction,
            embeds.success("Sucess", `Welcome channel set to: ${channel}`),
            { ephemeral: true}
        )


    }
} satisfies Subcommand;