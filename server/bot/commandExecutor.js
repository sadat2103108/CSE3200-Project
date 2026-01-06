// bot/commandExecutor.js

import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent
} from "../utils/calendar.js";

import { sendEmail } from "../utils/email.js";

import {
  createDocument,
  readDocument,
  appendContent,
  replaceContent,
  deleteDocument,
  listDocuments,
  shareDocument
} from "../utils/docs.js";

/**
 * Execute an array of bot commands.
 * Each command should have the structure:
 * {
 *   command: "calendar.add_event" | "calendar.update_event" | "calendar.delete_event" | "calendar.fetch" | 
 *            "email.send" | "docs.create" | "docs.read" | "docs.append" | "docs.replace" | "docs.list" | "docs.delete" | "docs.share",
 *   params: { ... }
 * }
 * Returns an object with fetchedData if calendar.fetch or docs.read/list was executed, otherwise null
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

        // ---- Google Docs Commands ----
        case "docs.create": {
          if (!params.title) {
            console.warn("⚠️ Missing title for docs.create");
            break;
          }
          const doc = await createDocument(params.title, params.content || "");
          console.log("📄 Created document:", {
            documentId: doc.documentId,
            title: doc.title,
            webViewLink: doc.webViewLink,
          });
          fetchedData = doc;
          break;
        }

        case "docs.read": {
          if (!params.documentId) {
            console.warn("⚠️ Missing documentId for docs.read");
            break;
          }
          const doc = await readDocument(params.documentId);
          console.log("📖 Read document:", {
            documentId: doc.documentId,
            title: doc.title,
            contentLength: doc.content.length,
          });
          fetchedData = doc;
          break;
        }

        case "docs.append": {
          if (!params.documentId || !params.content) {
            console.warn("⚠️ Missing documentId or content for docs.append");
            break;
          }
          await appendContent(params.documentId, params.content);
          console.log("➕ Appended content to document:", params.documentId);
          break;
        }

        case "docs.replace": {
          if (!params.documentId || !params.searchText || !params.replacementText) {
            console.warn("⚠️ Missing documentId, searchText, or replacementText for docs.replace");
            break;
          }
          const result = await replaceContent(params.documentId, params.searchText, params.replacementText);
          console.log("🔄 Replaced content in document:", {
            documentId: result.documentId,
            occurrencesChanged: result.replaceCount,
          });
          break;
        }

        case "docs.list": {
          const docs = await listDocuments(params.limit || 10);
          console.log("📚 Listed documents:", docs.length, "document(s) found");
          fetchedData = docs;
          break;
        }

        case "docs.delete": {
          if (!params.documentId) {
            console.warn("⚠️ Missing documentId for docs.delete");
            break;
          }
          await deleteDocument(params.documentId);
          console.log("🗑️ Deleted document:", params.documentId);
          break;
        }

        case "docs.share": {
          if (!params.documentId || !params.email) {
            console.warn("⚠️ Missing documentId or email for docs.share");
            break;
          }
          const result = await shareDocument(params.documentId, params.email, params.role || "reader");
          console.log("👥 Shared document:", {
            documentId: result.documentId,
            sharedWith: result.sharedWith,
            role: result.role,
          });
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
