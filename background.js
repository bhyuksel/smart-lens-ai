// SmartLens AI Background Service Worker

// System prompt for AI processing
const SYSTEM_PROMPT = `You are SmartLens AI, a multimodal autonomous reasoning agent inside a Chrome extension.
Your purpose is to analyze text, images, audio transcripts, or mixed inputs coming from a user-selected screen area and perform the correct action automatically.

You must ALWAYS act with precision, clarity, and structured reasoning.

CORE INTELLIGENCE — SMART MODE:
If the user does NOT specify a mode, you must automatically detect what the task is based on the input.

You must classify the content into one of the following categories:
- Grammar correction
- Spelling correction
- Question solving (any subject)
- Multiple-choice recognition
- Math problem solving (with steps)
- Reading comprehension
- Essay analysis
- Summarization
- Simplification of complex text
- Explanation / teaching mode
- Translation
- General reasoning / rewriting

OUTPUT FORMAT (ALWAYS FOLLOW):
[Detected Task]: <your detection>

[Action Taken]: <short explanation>

[Result]: <final answer in proper format>

[Optional Notes]: <only if necessary>

Rules:
- Output must always be clean and structured
- No unnecessary verbosity
- No hallucination
- If input is ambiguous → ask for clarification
- Always prioritize correctness over creativity
- Clear, professional, helpful tone`;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processCapture") {
    handleCaptureProcessing(request.data, sender.tab);
  } else if (request.action === "processText") {
    handleTextProcessing(request.data, sender.tab);
  }
});

// Handle captured screen area
async function handleCaptureProcessing(data, tab) {
  try {
    // Capture screenshot
    const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });

    // Crop to selected area (this would need canvas processing)
    // For now, we'll process the full screenshot with coordinates

    // Get API key from storage
    const { apiKey } = await chrome.storage.local.get("apiKey");

    if (!apiKey) {
      showResultNotification(
        tab.id,
        "⚠️ API key not configured. Please add your API key in the extension popup.",
        "error"
      );
      return;
    }

    // Process with AI (placeholder - integrate with your AI API)
    const result = await processWithAI(
      {
        type: "image",
        image: screenshot,
        coordinates: {
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
        },
        mode: data.mode,
      },
      apiKey
    );

    // Show result
    showResultPopup(tab.id, result);
  } catch (error) {
    console.error("Capture processing error:", error);
    showResultNotification(tab.id, "❌ Error processing capture", "error");
  }
}

// Handle text analysis
async function handleTextProcessing(data, tab) {
  try {
    // Get API key from storage
    const { apiKey } = await chrome.storage.local.get("apiKey");

    if (!apiKey) {
      showResultNotification(
        tab.id,
        "⚠️ API key not configured. Please add your API key in the extension popup.",
        "error"
      );
      return;
    }

    // Process with AI
    const result = await processWithAI(
      {
        type: "text",
        text: data.text,
        mode: data.mode,
      },
      apiKey
    );

    // Show result
    showResultPopup(tab.id, result);
  } catch (error) {
    console.error("Text processing error:", error);
    showResultNotification(tab.id, "❌ Error processing text", "error");
  }
}

// Process with AI API (placeholder function - integrate with your preferred AI API)
async function processWithAI(input, apiKey) {
  // This is a placeholder. You would integrate with:
  // - OpenAI API (GPT-4 Vision)
  // - Google Gemini API
  // - Anthropic Claude API
  // - Or your own backend

  // Example structure:
  const modeInstructions = {
    auto: "Automatically detect the task and provide appropriate response",
    grammar: "Focus on grammar and spelling correction",
    solve: "Solve the question step by step",
    summarize: "Provide a concise summary",
    explain: "Explain the content in simple terms",
  };

  const prompt = `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\nTask: ${
    modeInstructions[input.mode]
  }\n\n${
    input.type === "text"
      ? "Input Text: " + input.text
      : "Analyze the provided image."
  }`;

  // Simulated response for development
  return {
    detectedTask: "Demo Mode",
    action: "Simulated AI response",
    result: `This is a placeholder response. Please integrate with your AI API.\n\nInput type: ${input.type}\nMode: ${input.mode}\n\nTo activate:\n1. Add your API key in the extension popup\n2. Integrate the AI API in background.js (processWithAI function)\n3. Supported APIs: OpenAI, Google Gemini, Anthropic Claude`,
    notes: "Integration required",
  };
}

// Show result in a popup overlay
function showResultPopup(tabId, result) {
  chrome.tabs.sendMessage(tabId, {
    action: "showResult",
    result: result,
  });
}

// Show simple notification
function showResultNotification(tabId, message, type) {
  chrome.tabs.sendMessage(tabId, {
    action: "showNotification",
    message: message,
    type: type,
  });
}

// Context menu integration
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "smartlens-analyze",
    title: "🔍 Analyze with SmartLens AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "smartlens-analyze" && info.selectionText) {
    const { selectedMode } = await chrome.storage.local.get("selectedMode");
    handleTextProcessing(
      {
        text: info.selectionText,
        mode: selectedMode || "auto",
      },
      tab
    );
  }
});
