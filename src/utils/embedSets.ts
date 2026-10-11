import { EmbedBuilder, MessageFlags } from "mjx-client";
import type { InteractionReplyOptions, RepliableInteraction } from "mjx-client";


//had a bit of help from ai on this one to optimize it

export type EmbedType = 
| "success"
| "warning"
| "critical"
| "error"
| "commandError"
| "info"

const COLORS: Record<EmbedType,number> = {
    success: 0x61D394,
    warning: 0xECC02F,
    critical: 0xEC2B8F,
    error: 0xFF444C,
    commandError: 0xEC573F,
    info: 0x5865F2,
}

interface EmbedOptions {
    title?:  string;
    description?: string;
    footer?: string;
    timestamp?: boolean;
}

export function CreateEmbed(type: EmbedType, options:EmbedOptions) : EmbedBuilder {
    const embed = new EmbedBuilder() 
        .setColor(COLORS[type])

    if (options.title) {
        embed.setTitle(options.title)
    }
    if (options.description) {
        embed.setDescription(options.description)
    }

    if (options.footer) {
        embed.setFooter({text: options.footer})
    }
    if (options.timestamp !== false) {
        embed.setTimestamp();
    }

    return embed;
}


export const embeds = {
    success: (title: string, description: string ) => 
        CreateEmbed("success", {title, description}),
    warning: (title:string, description: string) =>
        CreateEmbed("warning", {title, description}),
    critical: (title: string, description: string) =>
        CreateEmbed("critical", {title, description}),
    error: (description: string, title?: string) =>
        CreateEmbed("error", {title, description}),
    commandErrror: (description: string, title?:string) =>
        CreateEmbed("commandError", {title, description}),
    info: (title: string, description: string) => 
        CreateEmbed("info", { title, description })
}

interface ReplyOptions {
    ephemeral?: boolean;
    content?: string;
}

export async function replyEmbed(
    interraction: RepliableInteraction,
    embed: EmbedBuilder,
    options: ReplyOptions = {}
) {
    const payload: InteractionReplyOptions = {
        embeds: [embed],
        ...(options.content !== undefined && {
            content: options.content,
        }),
        ...(options.ephemeral && {
            flags: MessageFlags.Ephemeral
        }),
    };

    if (interraction.deferred) {
        return interraction.editReply({
            embeds: payload.embeds,
            content: payload.content
        })
    }

    if (interraction.replied) {
        return interraction.followUp(payload)
    }

    return interraction.reply(payload)
}
