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
