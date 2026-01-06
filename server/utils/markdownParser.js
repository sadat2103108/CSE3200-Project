/**
 * Convert Markdown text to Google Docs formatting requests
 * This parser converts markdown syntax to Google Docs API batchUpdate requests
 */

export function parseMarkdownToDocRequests(content, startingIndex = 1) {
  const requests = [];
  let currentIndex = startingIndex; // Start from provided index

  // Split content into lines
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip completely empty lines
    if (line.trim() === "") {
      // Add empty line
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: "\n",
        },
      });
      currentIndex += 1;
      continue;
    }

    // Check for headings (###, ####, etc.)
    const headingMatch = line.match(/^(#+)\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];

      // Insert heading text with newline
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: text + "\n",
        },
      });

      const textLength = text.length + 1;
      const endIndex = currentIndex + textLength;

      // Apply heading style
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex: currentIndex,
            endIndex: endIndex,
          },
          paragraphStyle: {
            namedStyleType:
              level === 1
                ? "HEADING_1"
                : level === 2
                  ? "HEADING_2"
                  : level === 3
                    ? "HEADING_3"
                    : "HEADING_4",
          },
          fields: "namedStyleType",
        },
      });

      currentIndex = endIndex;
      continue;
    }

    // Check for bullet points (-, *, •)
    const bulletMatch = line.match(/^[\-\*•]\s+(.+)$/);
    if (bulletMatch) {
      const text = bulletMatch[1];

      // Insert text with newline (keep the dash, just as plain text)
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: "• " + text + "\n",
        },
      });

      const textLength = ("• " + text + "\n").length;
      currentIndex += textLength;
      continue;
    }

    // Regular paragraph with potential inline formatting
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: line + "\n",
      },
    });

    // Apply inline formatting (bold, italic, code)
    applyInlineFormatting(requests, currentIndex, line);

    currentIndex += line.length + 1; // +1 for newline
  }

  return requests;
}

/**
 * Apply inline formatting (bold, italic, code) to text
 */
function applyInlineFormatting(requests, baseIndex, text) {
  // Find and format bold text (**text**)
  const boldRegex = /\*\*(.+?)\*\*/g;
  let match;
  while ((match = boldRegex.exec(text)) !== null) {
    const startOffset = match.index;
    const contentLength = match[1].length;
    
    // Add 2 for the ** at the start
    const actualStart = baseIndex + startOffset + 2;
    const actualEnd = actualStart + contentLength;

    requests.push({
      updateTextStyle: {
        range: {
          startIndex: actualStart,
          endIndex: actualEnd,
        },
        textStyle: {
          bold: true,
        },
        fields: "bold",
      },
    });
  }

  // Find and format italic text (*text* or use single asterisk)
  // Note: We skip this to avoid conflicts with bold formatting
  // The bold regex will catch ** but single * might be ambiguous
}

/**
 * Convert markdown content to Google Docs using batchUpdate
 * This is the main function to use in docs.js
 */
export async function appendMarkdownContent(docs, auth, documentId, markdownContent) {
  try {
    // First, fetch the document to get the correct insertion point
    const doc = await docs.documents.get(
      {
        documentId: documentId,
      },
      { auth }
    );

    // Get the endIndex of the last element in the document
    const lastElement = doc.data.body.content[doc.data.body.content.length - 1];
    const contentLength = lastElement.endIndex;
    const startIndex = contentLength - 1; // Insert before the final index

    console.log("Document info:", {
      documentId,
      contentLength,
      startIndex,
      lastElementType: lastElement.paragraph ? "paragraph" : "other",
    });

    // Parse markdown to requests with correct starting index
    const requests = parseMarkdownToDocRequests(markdownContent, startIndex);

    console.log(`Generated ${requests.length} requests for markdown parsing`);

    if (requests.length === 0) {
      console.log("No content to add");
      return { success: true, documentId };
    }

    // Execute all requests
    const result = await docs.documents.batchUpdate(
      {
        documentId: documentId,
        requestBody: {
          requests: requests,
        },
      },
      { auth }
    );

    console.log("Batch update result:", result.data.replies.length, "replies");

    return {
      success: true,
      documentId,
      requestsExecuted: requests.length,
    };
  } catch (err) {
    console.error("Error appending markdown content:", err.message);
    throw err;
  }
}
