import {
  createDocument,
  readDocument,
  appendContent,
  replaceContent,
  deleteDocument,
  listDocuments,
  shareDocument,
  unshareDocument,
} from "../utils/docs.js";

export const docsCreateController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const doc = await createDocument(title, content || "");
    res.json({ document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create document" });
  }
};

export const docsReadController = async (req, res) => {
  try {
    const { documentId } = req.query;

    if (!documentId) {
      return res.status(400).json({ error: "documentId is required" });
    }

    const doc = await readDocument(documentId);
    res.json({ document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read document" });
  }
};

export const docsAppendController = async (req, res) => {
  try {
    const { documentId, content } = req.body;

    if (!documentId || !content) {
      return res
        .status(400)
        .json({ error: "documentId and content are required" });
    }

    const result = await appendContent(documentId, content);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to append content" });
  }
};

export const docsReplaceController = async (req, res) => {
  try {
    const { documentId, searchText, replacementText } = req.body;

    if (!documentId || !searchText || !replacementText) {
      return res.status(400).json({
        error: "documentId, searchText, and replacementText are required",
      });
    }

    const result = await replaceContent(documentId, searchText, replacementText);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to replace content" });
  }
};

export const docsDeleteController = async (req, res) => {
  try {
    const { documentId } = req.query;

    if (!documentId) {
      return res.status(400).json({ error: "documentId is required" });
    }

    const result = await deleteDocument(documentId);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete document" });
  }
};

export const docsListController = async (req, res) => {
  try {
    const { limit } = req.query;
    const maxResults = limit ? parseInt(limit) : 10;

    const documents = await listDocuments(maxResults);
    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list documents" });
  }
};

export const docsShareController = async (req, res) => {
  try {
    const { documentId, email, role } = req.body;

    if (!documentId || !email) {
      return res
        .status(400)
        .json({ error: "documentId and email are required" });
    }

    const result = await shareDocument(documentId, email, role || "reader");
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to share document" });
  }
};

export const docsUnshareController = async (req, res) => {
  try {
    const { documentId, permissionId } = req.body;

    if (!documentId || !permissionId) {
      return res
        .status(400)
        .json({ error: "documentId and permissionId are required" });
    }

    const result = await unshareDocument(documentId, permissionId);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unshare document" });
  }
};
