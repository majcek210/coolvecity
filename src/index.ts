import env from "./utils/env.js";
import Client, { GatewayIntentBits } from "mjx-client";

const client = new Client({ debug: true, intents: [GatewayIntentBits.Guilds] })
  .setName("Coolvecity")
  .setToken(env.DISCORD_TOKEN)
  .setDebug(env.DEBUG);

client.use(new URL("./app", import.meta.url)); // had to do this bc if i dont it wont resolve to the build after.
client.start();

client.pushCommands() // no token here bc its alr set before