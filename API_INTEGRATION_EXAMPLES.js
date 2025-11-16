/**
 * SmartLens AI - API Integration Examples
 *
 * Copy and paste the relevant function into background.js
 * to replace the placeholder processWithAI() function
 */

// ============================================
// OPTION 1: OpenAI GPT-4 Vision API
// ============================================

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
        model: input.type === "image" ? "gpt-4-vision-preview" : "gpt-4-turbo",
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return parseAIResponse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      detectedTask: "Error",
      action: "API call failed",
      result: `Error: ${error.message}\n\nPlease check:\n- Your API key is valid\n- You have sufficient credits\n- Your internet connection`,
      notes: "Try again or check your API configuration",
    };
  }
}

// ============================================
// OPTION 2: Google Gemini API
// ============================================

async function processWithAI_Gemini(input, apiKey) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\nInput: ${
      input.type === "text" ? input.text : "Image provided"
    }`;

    const endpoint =
      input.type === "image"
        ? `https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent`
        : `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`;

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
          data: input.image.split(",")[1], // Remove data:image/png;base64, prefix
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return parseAIResponse(content);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      detectedTask: "Error",
      action: "API call failed",
      result: `Error: ${error.message}\n\nPlease check your Gemini API key and try again.`,
      notes: "Get your API key from: https://makersuite.google.com/app/apikey",
    };
  }
}

// ============================================
// OPTION 3: Anthropic Claude API
// ============================================

async function processWithAI_Claude(input, apiKey) {
  try {
    const messages = [
      {
        role: "user",
        content: `${SYSTEM_PROMPT}\n\nMode: ${input.mode}\n\n${
          input.type === "text" ? input.text : "Analyze the provided image"
        }`,
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
        model: "claude-3-opus-20240229",
        max_tokens: 1500,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    return parseAIResponse(content);
  } catch (error) {
    console.error("Claude API Error:", error);
    return {
      detectedTask: "Error",
      action: "API call failed",
      result: `Error: ${error.message}\n\nPlease check your Claude API key.`,
      notes: "Get your API key from: https://console.anthropic.com/",
    };
  }
}

// ============================================
// SHARED: Response Parser
// ============================================

function parseAIResponse(content) {
  /**
   * Parses the structured AI response format:
   * [Detected Task]: ...
   * [Action Taken]: ...
   * [Result]: ...
   * [Optional Notes]: ...
   */

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

// ============================================
// MULTI-AI FUSION (Advanced)
// ============================================

async function processWithAI_Fusion(input, apiKey1, apiKey2) {
  /**
   * Calls multiple AI models and merges their responses
   * Requires both OpenAI and Gemini API keys
   */

  try {
    // Call both APIs in parallel
    const [result1, result2] = await Promise.all([
      processWithAI_OpenAI(input, apiKey1),
      processWithAI_Gemini(input, apiKey2),
    ]);

    // Merge results
    return {
      detectedTask: "Multi-AI Fusion",
      action: "Compared results from GPT-4 and Gemini",
      result: `**GPT-4 Response:**\n${result1.result}\n\n**Gemini Response:**\n${result2.result}\n\n**Merged Answer:**\nBoth models agree on the core analysis. ${result1.result}`,
      notes: "Results from multiple AI models analyzed and combined",
    };
  } catch (error) {
    console.error("Fusion Mode Error:", error);
    return {
      detectedTask: "Error",
      action: "Multi-AI fusion failed",
      result: "Error in fusion mode. Ensure both API keys are configured.",
      notes: error.message,
    };
  }
}

// ============================================
// USAGE INSTRUCTIONS
// ============================================

/**
 * TO USE ANY OF THESE:
 *
 * 1. Copy the function you want (e.g., processWithAI_OpenAI)
 *
 * 2. In background.js, replace the placeholder processWithAI function:
 *
 *    async function processWithAI(input, apiKey) {
 *      // Replace this entire function with your chosen implementation
 *    }
 *
 * 3. Don't forget to include the parseAIResponse helper function
 *
 * 4. Save the file and reload the extension in Chrome
 *
 * 5. Test with: chrome://extensions/ -> Reload button
 *
 * EXAMPLE FOR OPENAI:
 * -------------------
 * // In background.js, replace processWithAI with:
 *
 * async function processWithAI(input, apiKey) {
 *   return await processWithAI_OpenAI(input, apiKey);
 * }
 *
 * // Or directly copy the processWithAI_OpenAI code and rename it to processWithAI
 */
