import express from "express";
import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent
} from "../utils/calendar.js";

const router = express.Router();

/**
 * GET /calendar/fetch?from=ISO&to=ISO
 */
router.get("/fetch", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "from and to required (ISO format)" });
    }

    const events = await fetchEvents(from, to);
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * POST /calendar/add
 */
router.post("/add", async (req, res) => {
  try {
    const event = await addEvent(req.body);
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add event" });
  }
});

/**
 * PATCH /calendar/update/:id
 */
router.patch("/update", async (req, res) => {
  try {
    const { eventId } = req.query;   // from Postman: ?eventId=xyz
    const updates = req.body;        // { summary, description, start, end }

    if (!eventId) {
      return res.status(400).json({ error: "eventId required" });
    }

    const updatedEvent = await updateEvent(eventId, updates);
    res.json({ event: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});


/**
 * DELETE /calendar/delete/:id
 */
router.delete("/delete", async (req, res) => {
  try {
    const { eventId } = req.query; 
    if (!eventId) return res.status(400).json({ error: "eventId required" });

    await deleteEvent(eventId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});


export default router;
