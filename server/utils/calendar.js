import { google } from "googleapis";
import { getOAuthClient } from "./googleAuth.js";

const calendar = google.calendar({ version: "v3" });
/**
 * Fetch events in date range (simplified response)
 */
export async function fetchEvents(timeMin, timeMax) {
  const auth = getOAuthClient();

  const res = await calendar.events.list({
    auth,
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime"
  });

  // Only keep relevant info
  return res.data.items.map(event => ({
    id: event.id,
    summary: event.summary,
    description: event.description || "",
    start: event.start,
    end: event.end,
    htmlLink: event.htmlLink
  }));
}


/**
 * Add event
 */
export async function addEvent({ summary, description, start, end }) {
  const auth = getOAuthClient();

  const event = {
    summary: summary || "",
    description: description || "",
    start: { dateTime: start },
    end: { dateTime: end }
  };

  const res = await calendar.events.insert({
    auth,
    calendarId: "primary",
    requestBody: event
  });


  // Minimal response for bot
  return {
    id: res.data.id,
    summary: res.data.summary,
    description: res.data.description,
    start: res.data.start,
    end: res.data.end,
    htmlLink: res.data.htmlLink
  };
}

/**
 * Update event
 */
export async function updateEvent(eventId, updates) {
  const auth = getOAuthClient();

  const requestBody = {};

  if (updates.summary) requestBody.summary = updates.summary;
  if (updates.description) requestBody.description = updates.description;
  if (updates.start) requestBody.start = { dateTime: updates.start };
  if (updates.end) requestBody.end = { dateTime: updates.end };

  const res = await calendar.events.patch({
    auth,
    calendarId: "primary",
    eventId,
    requestBody
  });

  return {
    id: res.data.id,
    summary: res.data.summary,
    description: res.data.description,
    start: res.data.start,
    end: res.data.end,
    htmlLink: res.data.htmlLink
  };
}

/**
 * Delete event
 */
export async function deleteEvent(eventId) {
  const auth = getOAuthClient();

  await calendar.events.delete({
    auth,
    calendarId: "primary",
    eventId
  });

  return { success: true };
}
