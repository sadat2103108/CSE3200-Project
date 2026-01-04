export const botCommands = [
  {
    command: "calendar.fetch",
    description:
      "Fetches events from Google Calendar within a date range. All datetime values MUST include timezone offset or timezone.",
    params: {
      from: "ISO 8601 datetime WITH timezone offset (e.g. 2025-12-22T00:00:00+06:00)",
      to: "ISO 8601 datetime WITH timezone offset (e.g. 2025-12-23T00:00:00+06:00)"
    },
    example: {
      command: "calendar.fetch",
      params: {
        from: "2025-12-22T00:00:00+06:00",
        to: "2025-12-23T23:59:59+06:00"
      }
    }
  },

  {
    command: "calendar.add_event",
    description:
      "Adds a new event to Google Calendar. Start and end MUST include timezone offset (+06:00) or explicit timezone.",
    params: {
      summary: "Title of the event",
      description: "Optional description",
      start: "ISO 8601 datetime WITH timezone offset (e.g. 2025-12-22T08:00:00+06:00)",
      end: "ISO 8601 datetime WITH timezone offset (e.g. 2025-12-22T08:30:00+06:00)"
    },
    example: {
      command: "calendar.add_event",
      params: {
        summary: "Morning Walk",
        description: "Morning walk with a friend",
        start: "2025-12-22T08:00:00+06:00",
        end: "2025-12-22T08:30:00+06:00"
      }
    }
  },

  {
    command: "calendar.update_event",
    description:
      "Updates an existing calendar event. Any provided datetime MUST include timezone offset.",
    params: {
      eventId: "ID of the event to update",
      summary: "New title (optional)",
      description: "New description (optional)",
      start: "ISO 8601 datetime WITH timezone offset (optional)",
      end: "ISO 8601 datetime WITH timezone offset (optional)"
    },
    example: {
      command: "calendar.update_event",
      params: {
        eventId: "ui8nd7gb17v2fvrp1gdtfffa8s",
        summary: "Updated Morning Walk",
        start: "2025-12-22T09:00:00+06:00",
        end: "2025-12-22T09:30:00+06:00"
      }
    }
  },

  {
    command: "calendar.delete_event",
    description: "Deletes an event from Google Calendar.",
    params: {
      eventId: "ID of the event to delete"
    },
    example: {
      command: "calendar.delete_event",
      params: {
        eventId: "ui8nd7gb17v2fvrp1gdtfffa8s"
      }
    }
  },

  {
    command: "email.send",
    description: "Sends an email via Gmail.",
    params: {
      to: "Recipient email address",
      subject: "Email subject",
      body: "Email body text"
    },
    example: {
      command: "email.send",
      params: {
        to: "friend@example.com",
        subject: "Morning Walk",
        body: "Want to join me for a walk tomorrow at 8 AM?"
      }
    }
  }
];
