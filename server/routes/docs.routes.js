import express from "express";
import {
  docsCreateController,
  docsReadController,
  docsAppendController,
  docsReplaceController,
  docsDeleteController,
  docsListController,
  docsShareController,
  docsUnshareController,
} from "../controllers/docs.controllers.js";

const router = express.Router();

// Create a new document
router.post("/create", docsCreateController);

// Read a document
router.get("/read", docsReadController);

// Append content to a document
router.post("/append", docsAppendController);

// Replace content in a document
router.post("/replace", docsReplaceController);

// Delete a document
router.delete("/delete", docsDeleteController);

// List all documents
router.get("/list", docsListController);

// Share a document
router.post("/share", docsShareController);

// Unshare a document
router.post("/unshare", docsUnshareController);

export default router;
