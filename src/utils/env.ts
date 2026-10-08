import { config } from 'dotenv';
config();


const requiredEnvVars : string[] = [];

for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const env = Object.freeze({
    DEBUG: process.env.DEBUG === 'true',
} as const); //so we make it like this to prevent acidental changes later on.

export default env;