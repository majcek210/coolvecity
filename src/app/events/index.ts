import { Events } from "mjx-client"
import type { Event } from "mjx-client"
import logger from "../../utils/logger.js"

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: any) {
        logger.log(`Ready as ${client.user.tag} in ${client.guilds.cache.size} server(s)`)
    }
}