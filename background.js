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

    // Get API configuration from storage
    const config = await getApiConfig();

    if (!config.apiKey) {
      showResultNotification(
        tab.id,
        `⚠️ No API key configured for ${config.platformName}. Please add it in the extension popup.`,
        "error"
      );
      return;
    }

    // Process with AI using selected platform
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
      config.apiKey,
      config.platform
    );

    // Save to history
    await saveToHistory({
      type: "image",
      input: `Screen capture (${data.width}x${data.height})`,
      result: result,
      mode: data.mode,
      platform: config.platform,
    });

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
    // Get API configuration from storage
    const config = await getApiConfig();

    if (!config.apiKey) {
      showResultNotification(
        tab.id,
        `⚠️ No API key configured for ${config.platformName}. Please add it in the extension popup.`,
        "error"
      );
      return;
    }

    // Process with AI using selected platform
    const result = await processWithAI(
      {
        type: "text",
        text: data.text,
        mode: data.mode,
      },
      config.apiKey,
      config.platform
    );

    // Save to history
    await saveToHistory({
      type: "text",
      input: data.text,
      result: result,
      mode: data.mode,
      platform: config.platform,
    });

    // Show result
    showResultPopup(tab.id, result);
  } catch (error) {
    console.error("Text processing error:", error);
    showResultNotification(tab.id, "❌ Error processing text", "error");
  }
}

// Get API configuration
async function getApiConfig() {
  const result = await chrome.storage.local.get(["apiKeys", "activePlatform"]);
  const apiKeys = result.apiKeys || {};
  const platform = result.activePlatform || "openai";

  const platformNames = {
    openai: "OpenAI",
    claude: "Anthropic Claude",
    gemini: "Google Gemini",
    openrouter: "OpenRouter",
  };

  return {
    platform: platform,
    platformName: platformNames[platform] || platform,
    apiKey: apiKeys[platform]?.key || null,
  };
}

// Process with AI API - Multi-Platform Support
async function processWithAI(input, apiKey, platform = "openai") {
  // Route to the appropriate platform
  switch (platform) {
    case "openai":
      return await processWithAI_OpenAI(input, apiKey);
    case "claude":
      return await processWithAI_Claude(input, apiKey);
    case "gemini":
      return await processWithAI_Gemini(input, apiKey);
    case "openrouter":
      return await processWithAI_OpenRouter(input, apiKey);
    default:
      return await processWithAI_OpenAI(input, apiKey);
  }
}

// OpenAI Integration
async function processWithAI_OpenAI(input, apiKey) {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          input.type === "text"
            ? input.text
            : `Analyze this image based on mode: ${input.mode}`,
      },
    ];

    // For image input, add vision capability
    if (input.type === "image" && input.image) {
      messages[1].content = [
        { type: "text", text: `Mode: ${input.mode}. Analyze this image.` },
        { type: "image_url", image_url: { url: input.image } },
      ];
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: input.type === "image" ? "gpt-4o" : "gpt-4o-mini",
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return parseAIResponse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      detectedTask: "Error",
      action: "API call failed",
      result: `Error: ${error.message}\n\nPlease check:\n- Your API key is valid (starts with 'sk-')\n- You have sufficient credits in your OpenAI account\n- Your internet connection is working\n- The API key has the correct permissions`,
      notes: "Visit https://platform.openai.com to check your account",
    };
  }
}

// Claude Integration
async function processWithAI_Claude(input, apiKey) {
  try {
    const messages = [
      {
        role: "user",
        content:
          input.type === "text"
            ? `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\n\n${input.text}`
            : `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\n\nAnalyze the provided image.`,
      },
    ];

    // For images, Claude uses a different format
    if (input.type === "image" && input.image) {
      messages[0].content = [
        { type: "text", text: `${SYSTEM_PROMPT}\n\nMode: ${input.mode}` },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: "image/png",
            data: input.image.split(",")[1],
          },
        },
      ];
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const content = data.content[0].text;

    return parseAIResponse(content);
  } catch (error) {
    console.error("Claude API Error:", error);
    return {
      detectedTask: "Error",
      action: "Claude API call failed",
      result: `Error: ${error.message}\n\nPlease check:\n- Your Claude API key is valid (starts with 'sk-ant-')\n- You have sufficient credits\n- Your internet connection`,
      notes: "Visit https://console.anthropic.com to check your account",
    };
  }
}

// Gemini Integration
async function processWithAI_Gemini(input, apiKey) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\nInput: ${
      input.type === "text" ? input.text : "Image provided"
    }`;

    // Use Gemini 1.5 Pro for vision, Gemini 1.5 Flash for text
    const model =
      input.type === "image" ? "gemini-2.5-pro" : "gemini-2.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // Add image for vision model
    if (input.type === "image" && input.image) {
      body.contents[0].parts.push({
        inline_data: {
          mime_type: "image/png",
          data: input.image.split(",")[1],
        },
      });
    }

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return parseAIResponse(content);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      detectedTask: "Error",
      action: "Gemini API call failed",
      result: `Error: ${error.message}\n\nPlease check:\n- Your Gemini API key is valid (starts with 'AIza')\n- You haven't exceeded the free tier limit\n- Your internet connection`,
      notes: "Get your API key from: https://makersuite.google.com/app/apikey",
    };
  }
}

// OpenRouter Integration
async function processWithAI_OpenRouter(input, apiKey) {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          input.type === "text"
            ? input.text
            : `Analyze this image based on mode: ${input.mode}`,
      },
    ];

    // For image input
    if (input.type === "image" && input.image) {
      messages[1].content = [
        { type: "text", text: `Mode: ${input.mode}. Analyze this image.` },
        { type: "image_url", image_url: { url: input.image } },
      ];
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://smartlens-ai.extension",
          "X-Title": "SmartLens AI",
        },
        body: JSON.stringify({
          model:
            input.type === "image" ? "openai/gpt-4o" : "openai/gpt-4o-mini",
          messages: messages,
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return parseAIResponse(content);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return {
      detectedTask: "Error",
      action: "OpenRouter API call failed",
      result: `Error: ${error.message}\n\nPlease check:\n- Your OpenRouter API key is valid (starts with 'sk-or-')\n- You have sufficient credits\n- Your internet connection`,
      notes: "Visit https://openrouter.ai to check your account",
    };
  }
}

// Parse AI response into structured format
function parseAIResponse(content) {
  try {
    const taskMatch = content.match(/\[Detected Task\]:\s*(.+?)(?=\n|$)/i);
    const actionMatch = content.match(/\[Action Taken\]:\s*(.+?)(?=\n|$)/i);
    const resultMatch = content.match(
      /\[Result\]:\s*([\s\S]+?)(?=\[Optional Notes\]|$)/i
    );
    const notesMatch = content.match(/\[Optional Notes\]:\s*([\s\S]+?)$/i);

    return {
      detectedTask: taskMatch ? taskMatch[1].trim() : "Analysis Complete",
      action: actionMatch ? actionMatch[1].trim() : "Processed input",
      result: resultMatch ? resultMatch[1].trim() : content,
      notes: notesMatch ? notesMatch[1].trim() : "",
    };
  } catch (error) {
    // Fallback if parsing fails
    return {
      detectedTask: "Response Received",
      action: "AI processing complete",
      result: content,
      notes: "",
    };
  }
}

// Save analysis to history
async function saveToHistory(data) {
  try {
    const result = await chrome.storage.local.get(["analysisHistory"]);
    let history = result.analysisHistory || [];

    // Add new entry with timestamp
    const historyEntry = {
      timestamp: new Date().toISOString(),
      type: data.type,
      input: data.input,
      result: data.result,
      mode: data.mode,
      platform: data.platform,
    };

    history.push(historyEntry);

    // Keep only last 100 entries to prevent storage bloat
    if (history.length > 100) {
      history = history.slice(-100);
    }

    await chrome.storage.local.set({ analysisHistory: history });
  } catch (error) {
    console.error("Error saving to history:", error);
  }
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
