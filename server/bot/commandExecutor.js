// bot/commandExecutor.js

import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent
} from "../utils/calendar.js";

import { sendEmail } from "../utils/email.js";

/**
 * Execute an array of bot commands.
 * Each command should have the structure:
 * {
 *   command: "calendar.add_event" | "calendar.update_event" | "calendar.delete_event" | "calendar.fetch" | "email.send",
 *   params: { ... }
 * }
 * Returns an object with fetchedData if calendar.fetch was executed, otherwise null
 */
export async function executeBotCommands(commands) {
  if (!Array.isArray(commands)) {
    console.error("Commands must be an array");
    return { fetchedData: null };
  }

  let fetchedData = null;

  for (const cmd of commands) {
    try {
      const { command, params } = cmd;

      switch (command) {
        // ---- Calendar Commands ----
        case "calendar.add_event": {
          const event = await addEvent(params);
          console.log("✅ Added event:", {
            summary: event.summary,
            description: event.description,
            start: event.start?.dateTime,
            end: event.end?.dateTime,
            id: event.id,
          });
          break;
        }

        case "calendar.update_event": {
          if (!params.eventId) {
            console.warn("⚠️ Missing eventId for update_event");
            break;
          }
          const updatedEvent = await updateEvent(params.eventId, params);
          console.log("🔄 Updated event:", {
            summary: updatedEvent.summary,
            description: updatedEvent.description,
            start: updatedEvent.start?.dateTime,
            end: updatedEvent.end?.dateTime,
            id: updatedEvent.id,
          });
          break;
        }

        case "calendar.delete_event": {
          if (!params.eventId) {
            console.warn("⚠️ Missing eventId for delete_event");
            break;
          }
          await deleteEvent(params.eventId);
          console.log("❌ Deleted event with ID:", params.eventId);
          break;
        }

        case "calendar.fetch": {
          if (!params.from || !params.to) {
            console.warn("⚠️ Missing from/to for fetch");
            break;
          }
          const events = await fetchEvents(params.from, params.to);
          // Only show minimal info
          const minimalEvents = events.map(e => ({
            summary: e.summary,
            description: e.description,
            start: e.start?.dateTime,
            end: e.end?.dateTime,
            id: e.id,
          }));
          console.log("📅 Fetched events:", minimalEvents);
          // Store fetched data to return
          fetchedData = minimalEvents;
          break;
        }

        // ---- Email Command ----
        case "email.send": {
          if (!params.to || !params.subject || !params.body) {
            console.warn("⚠️ Missing to/subject/body for email.send");
            break;
          }
          const res = await sendEmail(params);
          console.log("✉️ Email sent:", { id: res.id, to: params.to, subject: params.subject });
          break;
        }

        default:
          console.warn("⚠️ Unknown command:", command);
      }
    } catch (err) {
      console.error("❌ Error executing command:", cmd, err);
    }
  }

  return { fetchedData };
}
