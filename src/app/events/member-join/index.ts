import { Events } from "mjx-client"
import type { Event } from "mjx-client"

import logger from "../../../utils/logger.js"
import { getWelcomeSettings } from "../../../db/welcome.js"

export default {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const settings = await getWelcomeSettings(member.guild.id);
            if (!settings.enabled ||!settings.channelId ) return; 

            const channel = member.guild.channels.cache.get(settings.channelId);
            if (!channel ||!channel.isSendable()) return;

            await channel.send(
                settings.message
                    .replaceAll("{user}", `${member}`)
                    .replaceAll("{numb}", String(member.guild.memberCount))
                    .replaceAll("{serv}", member.guild.name)
            )

        } catch (error) {
            logger.warn(`Could not send the welcome msg in ${member.guild.id}`, error);
        }
    }
} satisfies Event<Events.GuildMemberAdd>