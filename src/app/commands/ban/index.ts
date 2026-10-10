import { SlashCommandBuilder, MessageFlags, guildOnly, requirePermissions, PermissionFlagsBits } from "mjx-client";
import type { Command } from "mjx-client"
import { checkTarget, notifyUser } from "../../../handlers/moderation.js"


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
            await interaction.reply({ content: problem, flags: MessageFlags.Ephemeral })
            return
        }

        if (target && !target.bannable) {
            await interaction.reply({ content: "I can't ban that member, their role is above mine.", flags: MessageFlags.Ephemeral })
            return
        }

        //notify before the ban

        const wasNotified = await notifyUser(user, `You were banned from **${interaction.guild.name}**.\nReason: ${reason}`)

        try {
            await interaction.guild.members.ban(user.id, {
                reason: reason
            })
        } catch(err) {
            await interaction.reply({ content: "Something went wrong while trying to ban this user!", flags: MessageFlags.Ephemeral})
            return
        }

        // if his dms were off/ or we cant dm them

        const content = `Ban hammer has spoken! ${user} was banned.` + (wasNotified ? "" : "\nI couldn't DM them about it.")

        await interaction.reply({
            content: content,
            flags: MessageFlags.Ephemeral
        })


    }

} satisfies Command