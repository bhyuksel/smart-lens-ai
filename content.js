// SmartLens AI Content Script
let isCapturing = false;
let captureOverlay = null;
let startX, startY, endX, endY;
let selectionBox = null;
let isTableSelecting = false;
let highlightedTable = null;

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCapture") {
    startScreenCapture(request.mode);
  } else if (request.action === "analyzeText") {
    analyzeSelectedText(request.mode, request.text);
  } else if (request.action === "showResult") {
    showResultOverlay(request.result);
  } else if (request.action === "showNotification") {
    showNotification(request.message, request.type);
  } else if (request.action === "startTableSelect") {
    startTableSelection();
    sendResponse({ started: true });
  } else if (request.action === "stopTableSelect") {
    stopTableSelection();
    sendResponse({ stopped: true });
  }
});

// Start screen capture mode
function startScreenCapture(mode) {
  if (isCapturing) return;

  isCapturing = true;
  createCaptureOverlay();

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("keydown", onEscapeKey);
}

// Create capture overlay
function createCaptureOverlay() {
  captureOverlay = document.createElement("div");
  captureOverlay.id = "smartlens-capture-overlay";
  captureOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999999;
    cursor: crosshair;
  `;

  const instructions = document.createElement("div");
  instructions.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
    font-size: 14px;
    z-index: 1000000;
  `;
  instructions.innerHTML =
    "🔍 <strong>SmartLens AI:</strong> Click and drag to select area. Press ESC to cancel.";

  captureOverlay.appendChild(instructions);
  document.body.appendChild(captureOverlay);
}

// Mouse event handlers
function onMouseDown(e) {
  if (!isCapturing) return;

  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement("div");
  selectionBox.style.cssText = `
    position: fixed;
    border: 3px solid #667eea;
    background: rgba(102, 126, 234, 0.1);
    z-index: 1000000;
    pointer-events: none;
  `;
  document.body.appendChild(selectionBox);
}

function onMouseMove(e) {
  if (!isCapturing || !selectionBox) return;

  endX = e.clientX;
  endY = e.clientY;

  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  selectionBox.style.left = left + "px";
  selectionBox.style.top = top + "px";
  selectionBox.style.width = width + "px";
  selectionBox.style.height = height + "px";
}

function onMouseUp(e) {
  if (!isCapturing) return;

  endX = e.clientX;
  endY = e.clientY;

  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  if (width > 10 && height > 10) {
    captureArea(Math.min(startX, endX), Math.min(startY, endY), width, height);
  }

  cleanup();
}

function onEscapeKey(e) {
  if (e.key === "Escape" && isCapturing) {
    cleanup();
  }
}

// Capture the selected area
async function captureArea(x, y, width, height) {
  try {
    // Get selected mode
    const { selectedMode } = await chrome.storage.local.get("selectedMode");
    const mode = selectedMode || "auto";

    // Send capture data to background script
    chrome.runtime.sendMessage({
      action: "processCapture",
      data: {
        x,
        y,
        width,
        height,
        mode: mode,
        url: window.location.href,
      },
    });

    showNotification("📸 Capturing and analyzing...", "info");
  } catch (error) {
    showNotification("❌ Error capturing area", "error");
    console.error(error);
  }
}

// Analyze selected text
async function analyzeSelectedText(mode, providedText) {
  // Use provided text (from popup) or get current selection
  let selectedText = providedText;

  if (!selectedText) {
    selectedText = window.getSelection().toString().trim();
  }

  if (!selectedText) {
    showNotification("⚠️ No text selected", "error");
    return;
  }

  try {
    chrome.runtime.sendMessage({
      action: "processText",
      data: {
        text: selectedText,
        mode: mode,
      },
    });

    showNotification("🧠 Analyzing text...", "info");
  } catch (error) {
    showNotification("❌ Error analyzing text", "error");
    console.error(error);
  }
}

// Cleanup capture mode
function cleanup() {
  isCapturing = false;

  if (captureOverlay) {
    captureOverlay.remove();
    captureOverlay = null;
  }

  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }

  document.removeEventListener("mousedown", onMouseDown);
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  document.removeEventListener("keydown", onEscapeKey);
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "error" ? "#f44336" : type === "success" ? "#4caf50" : "#2196f3"
    };
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000001;
    font-family: Arial, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Show result in overlay popup
function showResultOverlay(result) {
  // Remove existing overlay if any
  const existingOverlay = document.getElementById("smartlens-result-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "smartlens-result-overlay";

  const container = document.createElement("div");
  container.id = "smartlens-result-container";

  // Header
  const header = document.createElement("div");
  header.id = "smartlens-result-header";
  header.innerHTML = `
    <h2>🔍 SmartLens AI Results</h2>
    <button id="smartlens-close-btn">×</button>
  `;

  // Content
  const content = document.createElement("div");
  content.id = "smartlens-result-content";
  content.innerHTML = formatResult(result);

  // Footer
  const footer = document.createElement("div");
  footer.id = "smartlens-result-footer";
  footer.innerHTML = `
    <button class="smartlens-copy-btn" id="smartlens-copy-result">📋 Copy Result</button>
    <span style="color: #999; font-size: 12px;">SmartLens AI v1.0</span>
  `;

  container.appendChild(header);
  container.appendChild(content);
  container.appendChild(footer);
  overlay.appendChild(container);
  document.body.appendChild(overlay);

  // Event listeners
  document
    .getElementById("smartlens-close-btn")
    .addEventListener("click", () => {
      overlay.remove();
    });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  document
    .getElementById("smartlens-copy-result")
    .addEventListener("click", () => {
      const textToCopy = result.result || JSON.stringify(result, null, 2);
      navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification("✅ Copied to clipboard!", "success");
      });
    });

  // ESC key to close
  const escHandler = (e) => {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}

// Format result for display
function formatResult(result) {
  let html = "";

  if (result.detectedTask) {
    html += `<h3>🎯 Detected Task</h3><p><strong>${result.detectedTask}</strong></p>`;
  }

  if (result.action) {
    html += `<h3>⚡ Action Taken</h3><p>${result.action}</p>`;
  }

  if (result.result) {
    html += `<h3>✨ Result</h3><pre>${result.result}</pre>`;
  }

  if (result.notes) {
    html += `<h3>📝 Notes</h3><p><em>${result.notes}</em></p>`;
  }

  return html || "<p>No results to display</p>";
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  
  /* Table selection highlighting */
  .smartlens-table-highlight {
    outline: 3px solid #11998e !important;
    outline-offset: 2px;
    background-color: rgba(17, 153, 142, 0.1) !important;
    cursor: pointer !important;
    transition: all 0.2s ease;
  }
  
  .smartlens-table-highlight:hover {
    outline: 4px solid #38ef7d !important;
    background-color: rgba(56, 239, 125, 0.15) !important;
  }
  
  .smartlens-table-badge {
    position: absolute;
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    font-family: Arial, sans-serif;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);

// ============================================================================
// TABLE SELECTION MODE
// ============================================================================

// Start table selection mode
function startTableSelection() {
  if (isTableSelecting) return;
  isTableSelecting = true;

  const tables = document.querySelectorAll("table");

  tables.forEach((table, index) => {
    table.classList.add("smartlens-table-selectable");
    table.dataset.smartlensIndex = index;

    // Add badge
    const badge = document.createElement("div");
    badge.className = "smartlens-table-badge";
    badge.textContent = `📊 Table ${index + 1}`;
    badge.style.cssText = `
      position: absolute;
      top: -25px;
      left: 0;
    `;

    // Make table position relative if needed
    const computedStyle = window.getComputedStyle(table);
    if (computedStyle.position === "static") {
      table.style.position = "relative";
    }

    table.appendChild(badge);

    // Add hover highlighting
    table.addEventListener("mouseenter", onTableHover);
    table.addEventListener("mouseleave", onTableLeave);
    table.addEventListener("click", onTableClick);
  });

  showNotification(
    `🔍 Found ${tables.length} tables. Click one to select.`,
    "info"
  );
}

// Stop table selection mode
function stopTableSelection() {
  isTableSelecting = false;

  const tables = document.querySelectorAll(".smartlens-table-selectable");
  tables.forEach((table) => {
    table.classList.remove(
      "smartlens-table-selectable",
      "smartlens-table-highlight"
    );

    // Remove badges
    const badges = table.querySelectorAll(".smartlens-table-badge");
    badges.forEach((b) => b.remove());

    // Remove event listeners
    table.removeEventListener("mouseenter", onTableHover);
    table.removeEventListener("mouseleave", onTableLeave);
    table.removeEventListener("click", onTableClick);
  });
}

function onTableHover(e) {
  e.currentTarget.classList.add("smartlens-table-highlight");
}

function onTableLeave(e) {
  e.currentTarget.classList.remove("smartlens-table-highlight");
}

function onTableClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const table = e.currentTarget;
  const tableData = extractTableData(table);

  // Send data back to popup
  chrome.runtime.sendMessage({
    action: "tableSelected",
    data: tableData,
  });

  showNotification(
    `✅ Table selected (${tableData.rows} rows × ${tableData.cols} cols)`,
    "success"
  );

  // Clean up
  stopTableSelection();
}

// Extract data from a table element
function extractTableData(table) {
  const rows = table.querySelectorAll("tr");
  const data = [];
  let headers = [];

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll("th, td");
    const rowData = [];

    cells.forEach((cell) => {
      rowData.push(cell.textContent.trim());
    });

    if (rowIndex === 0 && row.querySelectorAll("th").length > 0) {
      headers = rowData;
    } else {
      data.push(rowData);
    }
  });

  // If no headers found, use first row as headers
  if (headers.length === 0 && data.length > 0) {
    headers = data.shift();
  }

  return {
    headers: headers,
    data: data,
    rows: data.length,
    cols: headers.length || (data[0] ? data[0].length : 0),
    preview: headers.slice(0, 3).join(", ") + (headers.length > 3 ? "..." : ""),
  };
}
