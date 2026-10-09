import { SlashCommandBuilder } from "discord.js";
import type { Command } from "mjx-client";

export default {
    data: new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Replies with Pong!"),
    cooldown: 10,
    async execute(interaction) {
        await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`)
    }
} satisfies Command;