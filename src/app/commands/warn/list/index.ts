import { SlashCommandSubcommandBuilder, EmbedBuilder, MessageFlags} from "mjx-client";
import type { Subcommand } from "mjx-client";
import { getWarnings } from "../../../../db/moderations.js";

const MAX_REASON_LENGTH = 100; // so we dont break the discord's limit

export default {
    data:  new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("show member's warnings. ")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("The user to look up.")
            .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user", true)
        const warnings = await getWarnings(interaction.guildId!, user.id)

        if (warnings.length === 0) {
            await interaction.reply({content: `${user} has no warnings.`, flags: MessageFlags.Ephemeral});
            return
        }

        const embed = new EmbedBuilder()
            .setTitle(`Warnings for ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(
                 warnings.map(warning => {
                    const when = Math.floor(warning.createdAt.getTime() / 1000 );
                    const reason = warning.reason ?? "No reason given";
                    const shown = reason.length > MAX_REASON_LENGTH? reason.slice(0, MAX_REASON_LENGTH - 1) + "…" : reason;
                    return `**#${warning.number}** <t:${when}:R> by <@${warning.moderatorId}> \n${shown}`
                }).join("\n\n")) // ty to AI for writing this hard format/message
            .setFooter({text: `Showing the latest ${warnings.length}`})
        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral})
    }
} satisfies Subcommand