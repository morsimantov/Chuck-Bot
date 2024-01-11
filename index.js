import ChuckBot from './chuckBot.js';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const chuckBot = new ChuckBot(process.env.BOT_TOKEN);

chuckBot.start();