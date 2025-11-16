# 🚀 Quick Start Guide - SmartLens AI

## Installation (5 minutes)

### Step 1: Load Extension in Chrome

1. Open Google Chrome
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the folder: `/home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai`
6. The SmartLens AI icon should appear in your browser toolbar ✅

### Step 2: Create Icons (Optional)

If you don't see the extension icon properly:

**Option A: Use setup script**

```bash
cd /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai
./setup.sh
```

**Option B: Create manually**

- Go to `icons/` folder
- Add three PNG files: `icon16.png`, `icon48.png`, `icon128.png`
- Use any simple logo/icon with purple/blue colors
- Reload the extension in Chrome

### Step 3: Configure API Key

1. Click the SmartLens AI extension icon in toolbar
2. Scroll to "API Settings"
3. Enter your API key:
   - **OpenAI**: Get from https://platform.openai.com/api-keys
   - **Google Gemini**: Get from https://makersuite.google.com/app/apikey
   - **Anthropic Claude**: Get from https://console.anthropic.com/
4. Click **"Save"**

### Step 4: Integrate AI API (Required for full functionality)

Edit `background.js` - find the `processWithAI()` function (around line 70):

**For OpenAI GPT-4 Vision:**

```javascript
async function processWithAI(input, apiKey) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: input.type === "text" ? input.text : "Analyze this image",
    },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: messages,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse structured response
  return parseAIResponse(content);
}

function parseAIResponse(content) {
  // Extract sections from AI response
  const taskMatch = content.match(/\[Detected Task\]:\s*(.+)/);
  const actionMatch = content.match(/\[Action Taken\]:\s*(.+)/);
  const resultMatch = content.match(
    /\[Result\]:\s*([\s\S]+?)(\[Optional Notes\]|$)/
  );

  return {
    detectedTask: taskMatch ? taskMatch[1].trim() : "Analysis Complete",
    action: actionMatch ? actionMatch[1].trim() : "Processed input",
    result: resultMatch ? resultMatch[1].trim() : content,
    notes: "",
  };
}
```

**For Google Gemini:**

```javascript
async function processWithAI(input, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n${
                  input.type === "text" ? input.text : "Analyze this content"
                }`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;

  return parseAIResponse(content);
}
```

## Usage

### Method 1: Screen Capture 📸

1. Click SmartLens AI icon
2. Select mode or use "Auto Detect"
3. Click "📸 Capture Screen Area"
4. Click and drag to select any area
5. View results in popup

### Method 2: Text Analysis 📋

1. Select text on any webpage
2. Click SmartLens AI icon
3. Click "📋 Analyze Selected Text"
4. View structured response

### Method 3: Right-Click Menu 🖱️

1. Select text on webpage
2. Right-click
3. Choose "🔍 Analyze with SmartLens AI"

## Testing Without API

The extension works in demo mode without an API:

- It will show placeholder responses
- All UI features are functional
- Useful for testing the interface

## Troubleshooting

**Extension doesn't load:**

- Check that all files are in the correct folder
- Reload extension from `chrome://extensions/`

**No icon visible:**

- Create icon files in `icons/` folder (see Step 2)
- Any 16x16, 48x48, 128x128 PNG files will work

**"API key not configured":**

- Add your API key in extension popup
- Make sure to click "Save"

**Capture overlay doesn't appear:**

- Refresh the webpage
- Click the extension icon and try again

**AI responses are generic:**

- You need to integrate a real AI API in `background.js`
- See Step 4 above

## Features to Try

✅ Grammar correction: "This sentence have many mistake"
✅ Math solving: "Solve: 2x + 5 = 15"
✅ Question answering: "What is photosynthesis?"
✅ Summarization: Select a long article
✅ Multiple choice: Capture a quiz question
✅ Translation: Any foreign text
✅ Code explanation: Select code snippets

## Next Steps

1. **Customize modes**: Edit `popup.html` to add new modes
2. **Adjust AI behavior**: Modify `SYSTEM_PROMPT` in `background.js`
3. **Style changes**: Edit `popup.css` and `content.css`
4. **Add features**: Extend `content.js` with new capabilities

## Support

- **Documentation**: See `README.md`
- **Project Structure**: See folder layout in `README.md`
- **Icon Creation**: See `icons/README.md`

---

**You're ready to use SmartLens AI! 🎉**

Start by clicking the extension icon and trying "Auto Detect" mode on any text.
