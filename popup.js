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

      chrome.tabs.sendMessage(tab.id, {
        action: "analyzeText",
        mode: selectedMode,
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
});

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}
