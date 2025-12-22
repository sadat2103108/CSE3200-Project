import "dotenv/config";  // <-- this loads your .env

import { runBot } from "./bot/bot.js";


const res = await runBot("this is a prompt");

console.log(res)