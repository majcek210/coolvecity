import env from "./utils/env.js";
import Client, { GatewayIntentBits } from "mjx-client";
import { runMigrations } from "./db/handler.js";

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] })
  .setName("Coolvecity")
  .setToken(env.DISCORD_TOKEN)
  .setDebug(env.DEBUG);

//run migrations first
await runMigrations();

await client.use(new URL("./app", import.meta.url)); // had to do this bc if i dont it wont resolve to the build after.
await client.start();

await client.pushCommands() // no token here bc its alr set before