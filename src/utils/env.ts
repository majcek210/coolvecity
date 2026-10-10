import { config } from 'dotenv';
config();


const requiredEnvVars : string[] = [
    "DISCORD_TOKEN",
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD"
];

for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const env = Object.freeze({
    DEBUG: process.env.DEBUG === 'true',
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT || 3306),
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SSL: process.env.DB_SSL === 'true',
} as const); //so we make it like this to prevent acidental changes later on.

export default env;