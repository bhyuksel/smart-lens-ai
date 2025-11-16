// SmartLens AI Popup Controller
let selectedMode = "auto";

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

// Save API key
document.getElementById("saveApiKey").addEventListener("click", () => {
  const apiKey = document.getElementById("apiKey").value.trim();

  if (apiKey) {
    chrome.storage.local.set({ apiKey: apiKey }, () => {
      showStatus("API key saved successfully!", "success");
      document.getElementById("apiKey").value = "";
    });
  } else {
    showStatus("Please enter a valid API key", "error");
  }
});

// Load saved settings
chrome.storage.local.get(["selectedMode", "apiKey"], (result) => {
  if (result.selectedMode) {
    selectedMode = result.selectedMode;
    document
      .querySelector(`[data-mode="${selectedMode}"]`)
      ?.classList.add("active");
  } else {
    document.querySelector('[data-mode="auto"]')?.classList.add("active");
  }
});

function showStatus(message, type) {
  const status = document.getElementById("status");
  status.textContent = message;
  status.className = `status ${type}`;

  setTimeout(() => {
    status.style.display = "none";
  }, 3000);
}
