import { guildOnly, SlashCommandBuilder, PermissionFlagsBits, requirePermissions, Command, MessageFlags } from "mjx-client"
import { checkTarget } from "../../../handlers/moderation.js";
import { replyEmbed, embeds } from "../../../utils/embedSets.js";

export default {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("The command to kick the player.")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("The user to kick")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("The reason for the kick")
            .setMaxLength(500)
        ),

    guards: [guildOnly, requirePermissions(PermissionFlagsBits.KickMembers)],

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
        
        if (!target) {
            await replyEmbed(interaction, embeds.error("That user is not in this server."), {ephemeral: true})
            return
        }

        if (!target.kickable) {
            await replyEmbed(interaction, embeds.error("I cannot kick this user because they have a higher or equal role than me, or I lack the required permissions."), {ephemeral: true})
            return
        }

        let wasNotified = false

        try {
            await user.send({
                embeds: [
                    embeds.critical(
                        "Kicked!",
                        `You were kicked from **${interaction.guild.name}**.\nReason: ${reason}`
                    )
                ]
            })
            wasNotified = true
        } catch {
                    // dms off
                }

        try {
            await interaction.guild.members.kick(user, reason)
        } catch(err) {
            await replyEmbed(interaction, embeds.error("Something went wrong while trying to kick this user!"), {ephemeral: true})
            return
        }
        const content = `${user} was kicked.` + (wasNotified ? "" : "\nI couldn't DM them about it.")

        await interaction.reply({
            content: content,
                flags: MessageFlags.Ephemeral
        })
                
    }

} satisfies Command