import { google } from "googleapis";
import { getOAuthClient } from "./googleAuth.js";
import { appendMarkdownContent } from "./markdownParser.js";

const docs = google.docs("v1");
const drive = google.drive("v3");

/**
 * Create a new Google Document
 * @param {string} title - Document title
 * @param {string} content - Initial content for the document (supports markdown)
 * @returns {Promise<Object>} - Document info { documentId, title, webViewLink }
 */
export async function createDocument(title, content = "") {
  try {
    const auth = getOAuthClient();

    // Create document via Google Docs API
    const doc = await docs.documents.create(
      {
        requestBody: {
          title: title,
        },
      },
      { auth }
    );

    const documentId = doc.data.documentId;

    // If content provided, append it to the document with markdown parsing
    if (content.trim()) {
      await appendMarkdownContent(docs, auth, documentId, content);
    }

    // Get the webViewLink
    const driveFile = await drive.files.get(
      {
        fileId: documentId,
        fields: "webViewLink, name",
      },
      { auth }
    );

    return {
      documentId: documentId,
      title: driveFile.data.name,
      webViewLink: driveFile.data.webViewLink,
    };
  } catch (err) {
    console.error("Error creating document:", err.message);
    throw err;
  }
}

/**
 * Read a Google Document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} - Document content and metadata
 */
export async function readDocument(documentId) {
  try {
    const auth = getOAuthClient();

    const doc = await docs.documents.get(
      {
        documentId: documentId,
      },
      { auth }
    );

    // Extract plain text from document
    const content = extractTextFromDocument(doc.data);

    return {
      documentId: documentId,
      title: doc.data.title,
      content: content,
      webViewLink: doc.data.webViewLink,
    };
  } catch (err) {
    console.error("Error reading document:", err.message);
    throw err;
  }
}

/**
 * Append content to an existing Google Document with markdown support
 * @param {string} documentId - Document ID
 * @param {string} content - Content to append (supports markdown formatting)
 * @returns {Promise<void>}
 */
export async function appendContent(documentId, content) {
  try {
    const auth = getOAuthClient();

    // Use markdown parser to append formatted content
    return await appendMarkdownContent(docs, auth, documentId, content);
  } catch (err) {
    console.error("Error appending content:", err.message);
    throw err;
  }
}

/**
 * Replace content in a Google Document
 * @param {string} documentId - Document ID
 * @param {string} searchText - Text to search for
 * @param {string} replacementText - Text to replace with
 * @returns {Promise<Object>} - Update result
 */
export async function replaceContent(documentId, searchText, replacementText) {
  try {
    const auth = getOAuthClient();

    const result = await docs.documents.batchUpdate(
      {
        documentId: documentId,
        requestBody: {
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: searchText,
                  matchCase: false,
                },
                replaceText: replacementText,
              },
            },
          ],
        },
      },
      { auth }
    );

    return {
      success: true,
      documentId,
      replaceCount: result.data.replies[0].replaceAllText.occurrencesChanged,
    };
  } catch (err) {
    console.error("Error replacing content:", err.message);
    throw err;
  }
}

/**
 * Delete a Google Document
 * @param {string} documentId - Document ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export async function deleteDocument(documentId) {
  try {
    const auth = getOAuthClient();

    await drive.files.delete(
      {
        fileId: documentId,
      },
      { auth }
    );

    return { success: true, documentId, message: "Document deleted" };
  } catch (err) {
    console.error("Error deleting document:", err.message);
    throw err;
  }
}

/**
 * List user's Google Documents
 * @param {number} maxResults - Maximum results to return (default 10)
 * @returns {Promise<Array>} - List of documents
 */
export async function listDocuments(maxResults = 10) {
  try {
    const auth = getOAuthClient();

    const result = await drive.files.list(
      {
        q: "mimeType='application/vnd.google-apps.document' and trashed=false",
        spaces: "drive",
        fields: "files(id, name, createdTime, modifiedTime, webViewLink)",
        pageSize: maxResults,
        orderBy: "modifiedTime desc",
      },
      { auth }
    );

    return result.data.files.map((file) => ({
      documentId: file.id,
      title: file.name,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
    }));
  } catch (err) {
    console.error("Error listing documents:", err.message);
    throw err;
  }
}

/**
 * Share a Google Document with others
 * @param {string} documentId - Document ID
 * @param {string} email - Email address to share with
 * @param {string} role - Role: 'reader', 'commenter', 'writer'
 * @returns {Promise<Object>} - Permission info
 */
export async function shareDocument(documentId, email, role = "reader") {
  try {
    const auth = getOAuthClient();

    const permission = await drive.permissions.create(
      {
        fileId: documentId,
        requestBody: {
          role: role,
          type: "user",
          emailAddress: email,
        },
        fields: "id",
      },
      { auth }
    );

    return {
      success: true,
      documentId,
      sharedWith: email,
      role: role,
      permissionId: permission.data.id,
    };
  } catch (err) {
    console.error("Error sharing document:", err.message);
    throw err;
  }
}

/**
 * Unshare a Google Document from a user
 * @param {string} documentId - Document ID
 * @param {string} permissionId - Permission ID to remove
 * @returns {Promise<Object>} - Revocation confirmation
 */
export async function unshareDocument(documentId, permissionId) {
  try {
    const auth = getOAuthClient();

    await drive.permissions.delete(
      {
        fileId: documentId,
        permissionId: permissionId,
      },
      { auth }
    );

    return {
      success: true,
      documentId,
      message: "Permission revoked",
    };
  } catch (err) {
    console.error("Error unsharing document:", err.message);
    throw err;
  }
}

/**
 * Helper function to extract plain text from Google Docs document
 * @param {Object} docData - Document data from Google Docs API
 * @returns {string} - Extracted text
 */
function extractTextFromDocument(docData) {
  let text = "";

  if (docData.body && docData.body.content) {
    docData.body.content.forEach((element) => {
      if (element.paragraph && element.paragraph.elements) {
        element.paragraph.elements.forEach((el) => {
          if (el.textRun) {
            text += el.textRun.content;
          }
        });
        text += "\n"; // Add newline after each paragraph
      }
      if (element.table && element.table.tableRows) {
        // Handle table content if needed
        element.table.tableRows.forEach((row) => {
          row.tableCells.forEach((cell) => {
            if (cell.content) {
              cell.content.forEach((content) => {
                if (content.paragraph && content.paragraph.elements) {
                  content.paragraph.elements.forEach((el) => {
                    if (el.textRun) {
                      text += el.textRun.content;
                    }
                  });
                }
              });
              text += "\t";
            }
          });
          text += "\n";
        });
      }
    });
  }

  return text.trim();
}
