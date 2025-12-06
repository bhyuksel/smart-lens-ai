// SmartLens AI Popup Controller - Multi-Platform Support
let selectedMode = "auto";
let selectedPlatform = "openai";

// Mode selection
document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    selectedMode = this.dataset.mode;

    chrome.storage.local.set({ selectedMode: selectedMode });
    showStatus(`Mode: ${selectedMode.toUpperCase()}`, "success");
  });
});

// Platform selection
document.getElementById("apiPlatform").addEventListener("change", function () {
  selectedPlatform = this.value;
  updatePlatformInfo();
});

// Capture screen area
document.getElementById("captureBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, {
      action: "startCapture",
      mode: selectedMode,
    });

    window.close();
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  }
});

// Analyze selected text
document
  .getElementById("analyzeTextBtn")
  .addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // First, get the selected text from the page
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString().trim(),
      });

      const selectedText = results[0]?.result;

      if (!selectedText) {
        showStatus("⚠️ No text selected on the page", "error");
        return;
      }

      // Send the text directly for processing
      chrome.tabs.sendMessage(tab.id, {
        action: "analyzeText",
        mode: selectedMode,
        text: selectedText,
      });

      window.close();
    } catch (error) {
      showStatus("Error: " + error.message, "error");
    }
  });

// Save API key for selected platform
document.getElementById("saveApiKey").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const platform = document.getElementById("apiPlatform").value;

  if (!apiKey) {
    showStatus("Please enter a valid API key", "error");
    return;
  }

  // Validate API key format
  const validationResult = validateApiKey(platform, apiKey);
  if (!validationResult.valid) {
    showStatus(validationResult.message, "error");
    return;
  }

  // Load existing keys
  const result = await chrome.storage.local.get(["apiKeys", "activePlatform"]);
  const savedKeys = result.apiKeys || {};

  // Save new key
  savedKeys[platform] = {
    key: apiKey,
    addedAt: new Date().toISOString(),
  };

  // Save to storage
  await chrome.storage.local.set({
    apiKeys: savedKeys,
    activePlatform: platform, // Set as active platform
  });

  showStatus(`✅ ${getPlatformName(platform)} API key saved!`, "success");
  document.getElementById("apiKey").value = "";

  // Reload the keys list
  loadSavedKeys();
});

// Validate API key format
function validateApiKey(platform, key) {
  const validations = {
    openai: {
      pattern: /^sk-/,
      message: "OpenAI key should start with 'sk-'",
    },
    claude: {
      pattern: /^sk-ant-/,
      message: "Claude key should start with 'sk-ant-'",
    },
    gemini: {
      pattern: /^AIza/,
      message: "Gemini key should start with 'AIza'",
    },
    openrouter: {
      pattern: /^sk-or-/,
      message: "OpenRouter key should start with 'sk-or-'",
    },
  };

  const validation = validations[platform];
  if (!validation) {
    return { valid: true }; // Unknown platform, skip validation
  }

  if (!validation.pattern.test(key)) {
    return { valid: false, message: validation.message };
  }

  return { valid: true };
}

// Get platform display name
function getPlatformName(platform) {
  const names = {
    openai: "OpenAI",
    claude: "Anthropic Claude",
    gemini: "Google Gemini",
    openrouter: "OpenRouter",
  };
  return names[platform] || platform;
}

// Load and display saved API keys
async function loadSavedKeys() {
  const result = await chrome.storage.local.get(["apiKeys", "activePlatform"]);
  const savedKeys = result.apiKeys || {};
  const activePlatform = result.activePlatform || null;

  const keysList = document.getElementById("keysList");
  keysList.innerHTML = "";

  if (Object.keys(savedKeys).length === 0) {
    keysList.innerHTML =
      '<p style="color: #999; font-size: 11px; text-align: center;">No API keys saved yet</p>';
    return;
  }

  // Display each saved key
  Object.entries(savedKeys).forEach(([platform, data]) => {
    const keyItem = document.createElement("div");
    keyItem.className =
      "key-item" + (platform === activePlatform ? " active" : "");

    keyItem.innerHTML = `
      <div class="key-info">
        <span class="platform-badge ${platform}">${getPlatformName(
      platform
    )}</span>
        <span style="font-size: 11px; color: #666;">
          ${maskApiKey(data.key)}
        </span>
      </div>
      <div class="key-actions">
        <button class="key-btn use-btn" data-platform="${platform}">
          ${platform === activePlatform ? "✓ Active" : "Use"}
        </button>
        <button class="key-btn delete-btn" data-platform="${platform}">
          🗑️
        </button>
      </div>
    `;

    keysList.appendChild(keyItem);
  });

  // Add event listeners
  document.querySelectorAll(".use-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const platform = this.dataset.platform;
      await chrome.storage.local.set({ activePlatform: platform });
      showStatus(`✓ Switched to ${getPlatformName(platform)}`, "success");
      loadSavedKeys();
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const platform = this.dataset.platform;
      if (
        confirm(
          `Delete ${getPlatformName(platform)} API key? This cannot be undone.`
        )
      ) {
        const result = await chrome.storage.local.get(["apiKeys"]);
        const keys = result.apiKeys || {};
        delete keys[platform];
        await chrome.storage.local.set({ apiKeys: keys });
        showStatus(`Deleted ${getPlatformName(platform)} key`, "success");
        loadSavedKeys();
      }
    });
  });
}

// Mask API key for display
function maskApiKey(key) {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return key.substring(0, 7) + "•••••" + key.substring(key.length - 4);
}

// Update platform info text
function updatePlatformInfo() {
  const platform = document.getElementById("apiPlatform").value;
  const input = document.getElementById("apiKey");

  const placeholders = {
    openai: "sk-proj-...",
    claude: "sk-ant-...",
    gemini: "AIza...",
    openrouter: "sk-or-...",
  };

  input.placeholder = `Enter ${getPlatformName(platform)} API key (e.g., ${
    placeholders[platform]
  })`;
}

// Load saved settings on popup open
chrome.storage.local.get(["selectedMode", "activePlatform"], (result) => {
  if (result.selectedMode) {
    selectedMode = result.selectedMode;
    document
      .querySelector(`[data-mode="${selectedMode}"]`)
      ?.classList.add("active");
  } else {
    document.querySelector('[data-mode="auto"]')?.classList.add("active");
  }

  if (result.activePlatform) {
    document.getElementById("apiPlatform").value = result.activePlatform;
    selectedPlatform = result.activePlatform;
  }

  updatePlatformInfo();
  loadSavedKeys();
  loadHistory(); // Load history on popup open
});

// ============================================================================
// TABLE SCANNER FUNCTIONALITY
// ============================================================================

let currentTableData = null;
let selectedFormat = "json";

// Format button selection
document.querySelectorAll(".format-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll(".format-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    selectedFormat = this.dataset.format;

    // Re-render preview if we have data
    if (currentTableData) {
      renderTablePreview(currentTableData, selectedFormat);
    }
  });
});

// Scan Table button
document.getElementById("scanTableBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // Inject content script if not already
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    // Get tables from page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanTablesOnPage,
    });

    const tables = results[0]?.result || [];

    if (tables.length === 0) {
      showStatus("⚠️ No tables found on this page", "error");
      return;
    }

    // Show table section
    document.getElementById("tableSection").style.display = "block";

    // If only one table, use it directly
    if (tables.length === 1) {
      currentTableData = tables[0];
      renderTablePreview(currentTableData, selectedFormat);
      document.getElementById("tableActions").style.display = "flex";
      showStatus(
        `✅ Found 1 table (${currentTableData.rows} rows × ${currentTableData.cols} cols)`,
        "success"
      );
    } else {
      // Multiple tables - show selector
      showTableSelector(tables);
      showStatus(`✅ Found ${tables.length} tables`, "success");
    }
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  }
});

// Function to scan tables (runs in page context)
function scanTablesOnPage() {
  const tables = document.querySelectorAll("table");
  const result = [];

  tables.forEach((table, index) => {
    const rows = table.querySelectorAll("tr");
    if (rows.length === 0) return;

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

    if (headers.length > 0 || data.length > 0) {
      result.push({
        index: index,
        headers: headers,
        data: data,
        rows: data.length,
        cols: headers.length || (data[0] ? data[0].length : 0),
        preview:
          headers.slice(0, 3).join(", ") + (headers.length > 3 ? "..." : ""),
      });
    }
  });

  return result;
}

// Show table selector for multiple tables
function showTableSelector(tables) {
  const preview = document.getElementById("tablePreview");
  let html = '<div class="table-selector">';

  tables.forEach((table, i) => {
    html += `
      <div class="table-selector-item" data-index="${i}">
        <div class="table-info">
          <span>📊 Table ${i + 1}: ${table.preview || "No headers"}</span>
          <span class="table-info-badge">${table.rows} × ${table.cols}</span>
        </div>
      </div>
    `;
  });

  html += "</div>";
  preview.innerHTML = html;

  // Store tables for selection
  window.scannedTables = tables;

  // Add click handlers
  preview.querySelectorAll(".table-selector-item").forEach((item) => {
    item.addEventListener("click", function () {
      const index = parseInt(this.dataset.index);
      selectTable(index);
    });
  });
}

// Select a specific table
function selectTable(index) {
  currentTableData = window.scannedTables[index];
  renderTablePreview(currentTableData, selectedFormat);
  document.getElementById("tableActions").style.display = "flex";
}

// Render table preview in selected format
function renderTablePreview(tableData, format) {
  const preview = document.getElementById("tablePreview");
  let output = "";

  switch (format) {
    case "json":
      output = convertToJSON(tableData);
      preview.innerHTML = syntaxHighlightJSON(output);
      break;
    case "csv":
      output = convertToCSV(tableData);
      preview.textContent = output;
      break;
    case "toml":
      output = convertToTOML(tableData);
      preview.textContent = output;
      break;
    case "markdown":
      output = convertToMarkdown(tableData);
      preview.textContent = output;
      break;
    default:
      output = convertToJSON(tableData);
      preview.innerHTML = syntaxHighlightJSON(output);
  }

  // Store formatted output
  currentTableData.formattedOutput = output;
}

// Convert to JSON
function convertToJSON(tableData) {
  const result = tableData.data.map((row) => {
    const obj = {};
    tableData.headers.forEach((header, i) => {
      let value = row[i] || "";
      // Try to parse numbers
      if (!isNaN(value) && value !== "") {
        value = parseFloat(value);
      }
      obj[header || `column_${i + 1}`] = value;
    });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

// Convert to CSV
function convertToCSV(tableData) {
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = tableData.headers.map(escapeCSV).join(",");
  const dataRows = tableData.data
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");

  return headerRow + "\n" + dataRows;
}

// Convert to TOML
function convertToTOML(tableData) {
  let output = "# Table data exported by SmartLens AI\n\n";

  tableData.data.forEach((row, i) => {
    output += `[[records]]\n`;
    tableData.headers.forEach((header, j) => {
      const key =
        header.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() ||
        `column_${j + 1}`;
      let value = row[j] || "";

      if (!isNaN(value) && value !== "") {
        output += `${key} = ${parseFloat(value)}\n`;
      } else {
        output += `${key} = "${value.replace(/"/g, '\\"')}"\n`;
      }
    });
    output += "\n";
  });

  return output;
}

// Convert to Markdown
function convertToMarkdown(tableData) {
  const headers = tableData.headers.map((h) => h || "-").join(" | ");
  const separator = tableData.headers.map(() => "---").join(" | ");
  const rows = tableData.data
    .map((row) => row.map((cell) => cell || "-").join(" | "))
    .join("\n");

  return `| ${headers} |\n| ${separator} |\n${tableData.data
    .map((row) => `| ${row.map((cell) => cell || "-").join(" | ")} |`)
    .join("\n")}`;
}

// Syntax highlight JSON
function syntaxHighlightJSON(json) {
  return json
    .replace(/(".*?"):/g, '<span class="json-key">$1</span>:')
    .replace(/: (".*?")/g, ': <span class="json-string">$1</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="json-boolean">$1</span>');
}

// Close table section
document.getElementById("closeTableSection").addEventListener("click", () => {
  document.getElementById("tableSection").style.display = "none";
  currentTableData = null;
});

// Copy table data
document.getElementById("copyTableData").addEventListener("click", async () => {
  if (!currentTableData || !currentTableData.formattedOutput) {
    showStatus("⚠️ No data to copy", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(currentTableData.formattedOutput);
    showStatus("✅ Copied to clipboard!", "success");
  } catch (err) {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = currentTableData.formattedOutput;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showStatus("✅ Copied to clipboard!", "success");
  }
});

// Download table data
document.getElementById("downloadTableData").addEventListener("click", () => {
  if (!currentTableData || !currentTableData.formattedOutput) {
    showStatus("⚠️ No data to download", "error");
    return;
  }

  const extensions = { json: "json", csv: "csv", toml: "toml", markdown: "md" };
  const mimeTypes = {
    json: "application/json",
    csv: "text/csv",
    toml: "application/toml",
    markdown: "text/markdown",
  };

  const blob = new Blob([currentTableData.formattedOutput], {
    type: mimeTypes[selectedFormat] || "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `table_data.${extensions[selectedFormat] || "txt"}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showStatus("💾 Downloaded!", "success");
});

// Analyze table with AI
document
  .getElementById("analyzeTableAI")
  .addEventListener("click", async () => {
    if (!currentTableData) {
      showStatus("⚠️ No table data to analyze", "error");
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Send table data for AI analysis
      const jsonData = convertToJSON(currentTableData);
      const prompt = `Analyze this data table and provide insights:\n\n${jsonData}`;

      chrome.tabs.sendMessage(tab.id, {
        action: "analyzeText",
        mode: "auto",
        text: prompt,
      });

      window.close();
    } catch (error) {
      showStatus("Error: " + error.message, "error");
    }
  });

// ============================================================================
// HISTORY MANAGEMENT
// ============================================================================

// Load and display history
async function loadHistory() {
  const result = await chrome.storage.local.get(["analysisHistory"]);
  const history = result.analysisHistory || [];

  const historyList = document.getElementById("historyList");

  if (history.length === 0) {
    historyList.innerHTML =
      '<p class="empty-state">No analysis history yet</p>';
    return;
  }

  // Sort by timestamp (newest first)
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Take only the last 20 entries
  const recentHistory = history.slice(0, 20);

  historyList.innerHTML = recentHistory
    .map((item, index) => {
      const date = new Date(item.timestamp);
      const timeAgo = getTimeAgo(date);

      return `
      <div class="history-item" data-index="${index}">
        <div class="history-item-header">
          <div>
            <span class="history-item-type ${item.mode}">${getModeIcon(
        item.mode
      )} ${item.mode}</span>
            <span class="history-platform ${item.platform}">${
        item.platform
      }</span>
          </div>
          <span class="history-item-time">${timeAgo}</span>
        </div>
        <div class="history-item-content">${escapeHtml(item.input)}</div>
        <div class="history-item-result">${escapeHtml(
          item.result.substring(0, 200)
        )}${item.result.length > 200 ? "..." : ""}</div>
        <div class="history-item-actions">
          <button class="history-action-btn copy" data-action="copy" data-index="${index}">
            📋 Copy
          </button>
          <button class="history-action-btn view" data-action="view" data-index="${index}">
            👁️ View
          </button>
          <button class="history-action-btn delete" data-action="delete" data-index="${index}">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  // Add event listeners to action buttons
  document.querySelectorAll(".history-action-btn").forEach((btn) => {
    btn.addEventListener("click", handleHistoryAction);
  });
}

// Handle history item actions
async function handleHistoryAction(e) {
  e.stopPropagation();

  const action = e.currentTarget.dataset.action;
  const index = parseInt(e.currentTarget.dataset.index);

  const result = await chrome.storage.local.get(["analysisHistory"]);
  const history = result.analysisHistory || [];
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const item = history.slice(0, 20)[index];

  if (!item) return;

  switch (action) {
    case "copy":
      await copyToClipboard(item.result);
      showStatus("✅ Copied to clipboard!", "success");
      break;

    case "view":
      viewHistoryItem(item);
      break;

    case "delete":
      await deleteHistoryItem(index);
      showStatus("🗑️ Item deleted", "success");
      loadHistory();
      break;
  }
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

// View full history item
function viewHistoryItem(item) {
  // Send message to open a new tab or show in overlay
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showResult",
        result: item.result,
      });
      window.close();
    }
  });
}

// Delete history item
async function deleteHistoryItem(index) {
  const result = await chrome.storage.local.get(["analysisHistory"]);
  const history = result.analysisHistory || [];
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Remove item at index
  const recentHistory = history.slice(0, 20);
  const itemToDelete = recentHistory[index];

  // Find and remove from original array
  const originalIndex = history.findIndex(
    (h) =>
      h.timestamp === itemToDelete.timestamp && h.input === itemToDelete.input
  );

  if (originalIndex !== -1) {
    history.splice(originalIndex, 1);
    await chrome.storage.local.set({ analysisHistory: history });
  }
}

// Clear all history
document
  .getElementById("clearHistoryBtn")
  .addEventListener("click", async () => {
    if (
      confirm(
        "Are you sure you want to clear all history? This cannot be undone."
      )
    ) {
      await chrome.storage.local.set({ analysisHistory: [] });
      loadHistory();
      showStatus("🗑️ History cleared", "success");
    }
  });

// Helper: Get mode icon
function getModeIcon(mode) {
  const icons = {
    auto: "🤖",
    grammar: "✍️",
    solve: "🧠",
    summarize: "📝",
    explain: "💡",
    text: "📄",
    image: "📸",
  };
  return icons[mode] || "📄";
}

// Helper: Get time ago string
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// END HISTORY MANAGEMENT
// ============================================================================

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}
