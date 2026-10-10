import { SlashCommandSubcommandBuilder, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, MessageFlags } from "mjx-client";
import type { Subcommand } from "mjx-client";
import { DEFAULT_WELCOME_MESSAGE, getWelcomeSettings } from "../../../../db/welcome.js"

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName("message")
        .setDescription("A custom welcome message"),
    async execute(interaction) {

        if (!interaction?.guild?.id) {
            await interaction.reply({content: "Something went wrong.", flags: MessageFlags.Ephemeral})
            return
        }

        const {message} = await getWelcomeSettings(interaction.guild.id)
        
        const messageModal = new ModalBuilder()
            .setCustomId("welcome/message")
            .setTitle("Welcome message")

        const messageInput = new TextInputBuilder()
            .setCustomId("welcome/messageInput")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(DEFAULT_WELCOME_MESSAGE)
            .setRequired(true)
            .setMaxLength(120)
            .setMinLength(10)
            .setValue(message ||DEFAULT_WELCOME_MESSAGE)
        
        const messageLabel = new LabelBuilder()
            .setLabel("Enter your custom message.")
            .setDescription("{user} = user mention, {numb} = join number, {serv} = server name")
            .setTextInputComponent(messageInput)
        

        
        messageModal.addLabelComponents(messageLabel);

        await interaction.showModal(messageModal)

    }
} satisfies Subcommand;