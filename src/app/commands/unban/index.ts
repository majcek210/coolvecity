import { SlashCommandBuilder, MessageFlags, guildOnly, requirePermissions, PermissionFlagsBits } from "mjx-client";
import type { Command } from "mjx-client"

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
            await interaction.reply({ content: "That doesn't look like a user ID.", flags: MessageFlags.Ephemeral })
            return
        }

        try {
            await interaction.guild.members.unban(userId, reason)
        } catch(err) {
            await interaction.reply({ content: "Something went wrong while trying to unban this user! Are they actually banned?", flags: MessageFlags.Ephemeral })
            return
        }
        await interaction.reply({ content: `<@${userId}> was unbanned`, flags: MessageFlags.Ephemeral})


    }

} satisfies Command