import { SlashCommandBuilder, MessageFlags, guildOnly, requirePermissions, PermissionFlagsBits } from "mjx-client";
import type { Command } from "mjx-client"
import { checkTarget, notifyUser } from "../../../handlers/moderation.js"
import { replyEmbed, embeds } from "../../../utils/embedSets.js";


export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("A command to ban the user.")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("The user to ban.")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("Reason for the ban.")
            .setMaxLength(500)
        ),

    guards: [guildOnly, requirePermissions(PermissionFlagsBits.BanMembers)],
    async execute(interaction) {
        if (!interaction.inCachedGuild()) return;

        const user = interaction.options.getUser("user", true)
        const reason = interaction.options.getString("reason") ?? "No reason given."
        const target = interaction.options.getMember("user")

        const problem = checkTarget(interaction.member, user, target, true);

        if (problem) {
            await replyEmbed(interaction, embeds.error(problem), {ephemeral: true})
            return
        }

        if (target && !target.bannable) {
            await replyEmbed(interaction, embeds.error("I cannot ban this user because they have a higher or equal role than me, or I lack the required permissions."), {ephemeral: true})
            return
        }

        //notify before the ban bc then maybe wwe coundt get to the user anymore.


        let wasNotified = false;

        //try here bc dms might be off
        try {
            await user.send({
                embeds: [
                    embeds.critical(
                        "Ban hammer has spoken!",
                         `You were banned from **${interaction.guild.name}**.\nReason: ${reason}`
                    )
                ]
            })
            wasNotified = true
        } catch {
            // if his dms were off/ or we cant dm them
        }

        try {
            await interaction.guild.members.ban(user.id, {
                reason: reason
            })
        } catch(err) {
            await replyEmbed(interaction, embeds.error("Something went wrong while trying to ban this user!"), {ephemeral: true})
            return
        }
        
        await replyEmbed(
            interaction,
            embeds.success("Ban hammer has spoken!", `${user} was banned.` + (wasNotified ? "" : "\nI couldn't DM them about it.")),
            { ephemeral: true }
        )

    }

} satisfies Command