import "dotenv/config";  // <-- this loads your .env

import { runBot } from "./bot/bot.js";


await runBot("send a mail to the.invixible@gmail.com to ask about how is he doing, mention who you are");
