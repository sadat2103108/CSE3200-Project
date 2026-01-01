# Telegram Chat App

This module connects the core bot logic to Telegram.

## Responsibilities
- Receive messages from Telegram
- Forward message text to `runBot()`
- Send `user_reply` back to the user

## What this module does NOT do
- No AI logic
- No memory handling
- No database access

## Message Flow
Telegram message
→ handler.js
→ runBot()
→ Telegram reply

## Entry Point
startTelegramBot() from index.js
