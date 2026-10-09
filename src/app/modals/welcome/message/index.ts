import { MessageFlags } from "mjx-client";
import type { Modal } from "mjx-client";
import { setWelcomeMessage } from "../../../../db/welcome.js"

// Matches customId "welcome/message"
export default {
    async execute(interaction) {
        const message = interaction.fields.getTextInputValue("welcome/messageInput");

        const guildId = interaction.guild?.id
        if (!guildId) {
            await interaction.reply({ content: `Something went wrong.`, flags: MessageFlags.Ephemeral });
            return
        }
    
        await setWelcomeMessage(guildId, message)

        await interaction.reply({ content: `Welcome message set!`, flags: MessageFlags.Ephemeral });
    }
} satisfies Modal;
