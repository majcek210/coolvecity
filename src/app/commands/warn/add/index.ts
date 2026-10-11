import { SlashCommandSubcommandBuilder, MessageFlags} from "mjx-client";
import type { Subcommand } from "mjx-client"

import { addWarning, countWarnings } from "../../../../db/moderations.js"
import { checkTarget, notifyUser } from "../../../../handlers/moderation.js"
import { replyEmbed, embeds } from "../../../../utils/embedSets.js";

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
            await replyEmbed(
                interaction,
                embeds.error(problem),
                { ephemeral: true}
            )
            return
        }

        const number = await addWarning(interaction.guildId, user, interaction.user, reason);
        const total = await countWarnings(interaction.guildId, user.id);

        let wasNotified = false;

        //try here bc dms might be off
        try {
            await user.send({
                embeds: [
                    embeds.warning(
                        "You have been warned!",
                        `You were warned in **${interaction.guild.name}**.\nReason: ${reason}`
                    )
                ]
            })
            wasNotified = true
        } catch {
             // if his dms were off/ or we cant dm them
        }
        await replyEmbed(
                interaction,
                embeds.success("User was warned.", `Warned ${user} (warning #${number}, ${total} in total).\nReason: ${reason}` + (wasNotified ? "" : "\nI couldn't DM them about it.")),
                { ephemeral: true }
        )

    }
} satisfies Subcommand