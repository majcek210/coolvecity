import { MessageFlags } from "mjx-client";
import type { Modal } from "mjx-client";
import { setWelcomeMessage } from "../../../../db/welcome.js"
import { replyEmbed, embeds } from "../../../../utils/embedSets.js"

// Matches customId "welcome/message"
export default {
    async execute(interaction) {
        if (!interaction.inCachedGuild()) return;
        const message = interaction.fields.getTextInputValue("welcome/messageInput");

        const guildId = interaction.guild.id
    
        await setWelcomeMessage(guildId, message)

        await replyEmbed(
            interaction,
            embeds.success("Sucess", "Welcome message set!")
        )
    }
} satisfies Modal;
