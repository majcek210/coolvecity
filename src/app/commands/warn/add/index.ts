import { SlashCommandSubcommandBuilder, MessageFlags} from "mjx-client";
import type { Subcommand } from "mjx-client"

import { addWarning, countWarnings } from "../../../../db/moderations.js"
import { checkTarget, notifyUser } from "../../../../handlers/moderation.js"

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Warn a server member.")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("The member to warn.")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("The reason for the warn")
            .setMaxLength(500)
        ),
    async execute(interaction) {
        if(!interaction.inCachedGuild()) return;

        const user = interaction.options.getUser("user", true);
        const reason = interaction.options.getString("reason") ?? "No reason given";

        const problem = checkTarget(interaction.member, user, interaction.options.getMember("user"));

        if (problem) {
            await interaction.reply({ content: problem, flags: MessageFlags.Ephemeral })
            return
        }

        const number = await addWarning(interaction.guildId, user, interaction.user, reason);
        const total = await countWarnings(interaction.guildId, user.id);

        const notified = await notifyUser(user, `You were warned in **${interaction.guild.name}**.\nReason: ${reason}`)

        await interaction.reply({
            content: `Warned ${user} (warning #${number}, ${total} in total).\nReason: ${reason}`
                + (notified ? "" : "\nI couldn't DM them about it."),
            allowedMentions: { parse: [] }
        });

    }
} satisfies Subcommand