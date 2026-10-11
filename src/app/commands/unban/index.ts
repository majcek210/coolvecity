import { SlashCommandBuilder, MessageFlags, guildOnly, requirePermissions, PermissionFlagsBits } from "mjx-client";
import type { Command } from "mjx-client"
import { replyEmbed, embeds } from "../../../utils/embedSets.js"

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("A command to unban the user.")
        .addStringOption(option =>
            option.setName("userid")
            .setDescription("The user ID of the person to unban.")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("Reason for the unban.")
            .setMaxLength(500)
        ),

    guards: [guildOnly, requirePermissions(PermissionFlagsBits.BanMembers)],
    async execute(interaction) {
        if (!interaction.inCachedGuild()) return;

        const userId = interaction.options.getString("userid", true)
        const reason = interaction.options.getString("reason") ?? "No reason given."

        // ai wrote this regex
        if (!/^\d{17,20}$/.test(userId)) {
            
            await replyEmbed(
                interaction,
                embeds.warning("Check again!", "That doesn't look like a user ID."),
                { ephemeral: true}
            )
            return
        }

        try {
            await interaction.guild.members.unban(userId, reason)
        } catch(err) {
            await replyEmbed(
                interaction,
                embeds.error("Something went wrong while trying to unban this user! Are they actually banned?"),
                { ephemeral: true}
            )
            return
        }
        await replyEmbed(
                interaction,
                embeds.success("Sucess", `<@${userId}> was unbanned.`),
                { ephemeral: true}
        )


    }

} satisfies Command