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
  },

  {
    command: "docs.create",
    description: "Creates a new Google Document with optional initial content. Perfect for drafting notes, documents, or any text-based content.",
    params: {
      title: "Title of the document",
      content: "Initial content to add to the document (optional)"
    },
    example: {
      command: "docs.create",
      params: {
        title: "Meeting Notes - Dec 22",
        content: "Meeting attendees:\n- Alice\n- Bob\n\nAgenda:\n1. Project updates\n2. Budget discussion"
      }
    }
  },

  {
    command: "docs.read",
    description: "Reads and retrieves the full content of an existing Google Document.",
    params: {
      documentId: "The unique ID of the Google Document to read"
    },
    example: {
      command: "docs.read",
      params: {
        documentId: "1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ"
      }
    }
  },

  {
    command: "docs.append",
    description: "Appends new content to the end of an existing Google Document while preserving existing content.",
    params: {
      documentId: "The unique ID of the Google Document",
      content: "Content to append to the document"
    },
    example: {
      command: "docs.append",
      params: {
        documentId: "1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ",
        content: "\n\nAction Items:\n- Follow up with client by Friday\n- Prepare presentation slides"
      }
    }
  },

  {
    command: "docs.replace",
    description: "Finds and replaces specific text within a Google Document. Useful for updating sections or correcting content.",
    params: {
      documentId: "The unique ID of the Google Document",
      searchText: "The text to search for",
      replacementText: "The text to replace it with"
    },
    example: {
      command: "docs.replace",
      params: {
        documentId: "1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ",
        searchText: "Budget discussion",
        replacementText: "Budget discussion - Q1 2026 outlook"
      }
    }
  },

  {
    command: "docs.list",
    description: "Lists all Google Documents in the user's Drive, ordered by most recently modified.",
    params: {
      limit: "Maximum number of documents to return (optional, default: 10)"
    },
    example: {
      command: "docs.list",
      params: {
        limit: 5
      }
    }
  },

  {
    command: "docs.delete",
    description: "Permanently deletes a Google Document from Drive.",
    params: {
      documentId: "The unique ID of the Google Document to delete"
    },
    example: {
      command: "docs.delete",
      params: {
        documentId: "1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ"
      }
    }
  },

  {
    command: "docs.share",
    description: "Shares a Google Document with another user via their email address. Set access level with role parameter.",
    params: {
      documentId: "The unique ID of the Google Document",
      email: "Email address to share with",
      role: "Access level: 'reader' (view only), 'commenter' (view and comment), 'writer' (edit) - default is 'reader'"
    },
    example: {
      command: "docs.share",
      params: {
        documentId: "1BxiMVs0XRA5nFMoog2qNJvwpkQHu8z12LoKr6Tti-sQ",
        email: "colleague@company.com",
        role: "writer"
      }
    }
  }
];
