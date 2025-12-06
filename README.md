# 🔍 SmartLens AI

**Multimodal Autonomous Reasoning Agent Chrome Extension**

SmartLens AI is an intelligent Chrome extension that analyzes text, images, audio transcripts, and mixed inputs from any screen area to automatically detect tasks and provide precise, structured responses.

## ✨ Features

### 🤖 Smart Auto-Detection

- Automatically classifies content type and task
- No manual mode selection required
- Intelligent task routing

### 📋 Multiple Analysis Modes

- **Auto Detect**: Automatically identifies the best approach
- **Grammar**: Corrections and improvements
- **Solve Question**: Step-by-step problem solving
- **Summarize**: Concise content summaries
- **Explain**: Teaching and clarification mode

### 🎯 Core Capabilities

- ✍️ Grammar & spelling correction
- 🧠 Question solving (math, science, any subject)
- 📊 Multiple-choice recognition
- 📝 Text summarization
- 💡 Complex concept explanation
- 🔄 Translation support
- 📸 OCR text extraction
- 📈 Diagram/table/graph interpretation
- 🎧 Audio transcript analysis

### 🛠️ User Interface

- Screen area capture tool
- Selected text analysis
- Context menu integration
- Beautiful, modern UI
- Real-time notifications
- **📜 Analysis History** - Track all analyses with copy/view/delete actions
- **📊 Table Scanner** - Extract data tables to JSON, CSV, TOML, or Markdown

## 📊 Table Scanner

SmartLens AI can detect and extract HTML tables from any webpage:

### Features

- **🔍 Auto-Detection**: Finds all tables on the current page
- **📋 Multiple Formats**: Export to JSON, CSV, TOML, or Markdown
- **📋 Copy & Download**: One-click copy or download as file
- **🤖 AI Analysis**: Analyze table data with AI for insights
- **🎨 Syntax Highlighting**: Beautiful JSON preview with colors

### How to Use

1. Click the SmartLens AI extension icon
2. Click "📊 Scan Data Table" button
3. If multiple tables found, select one from the list
4. Choose your export format (JSON, CSV, TOML, Markdown)
5. Use Copy, Download, or Analyze with AI buttons

### Export Formats

| Format   | Description              | Best For                    |
| -------- | ------------------------ | --------------------------- |
| JSON     | Structured object array  | APIs, programming           |
| CSV      | Comma-separated values   | Excel, spreadsheets         |
| TOML     | Configuration format     | Config files, data exchange |
| Markdown | Table in markdown syntax | Documentation, notes        |

## 🚀 Installation

### Development Setup

1. **Clone or download the project**

   ```bash
   cd /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai
   ```

2. **Open Chrome Extensions**

   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)

3. **Load the extension**

   - Click "Load unpacked"
   - Select the `smart_lens_ai` folder

4. **Configure API Key**
   - Click the SmartLens AI icon
   - Enter your AI API key (OpenAI, Google Gemini, etc.)
   - Click "Save"

## 📖 Usage

### Method 1: Screen Capture

1. Click the SmartLens AI extension icon
2. Select a mode (or use Auto Detect)
3. Click "📸 Capture Screen Area"
4. Click and drag to select any area on the screen
5. View the AI analysis results

### Method 2: Text Selection

1. Select any text on a webpage
2. Click the SmartLens AI icon
3. Click "📋 Analyze Selected Text"
4. View the structured response

### Method 3: Context Menu

1. Select text on any webpage
2. Right-click
3. Choose "🔍 Analyze with SmartLens AI"

## 📜 Analysis History

SmartLens AI automatically tracks all your analyses:

### Features

- **📋 Automatic Tracking**: Every analysis is saved with input, result, mode, and platform
- **🔍 Quick Review**: Scroll through your last 20 analyses in the popup
- **📋 Copy Results**: One-click copy to clipboard
- **👁️ View Full Response**: Open complete results in overlay
- **🗑️ Delete Entries**: Remove individual items or clear all history
- **🎨 Color-Coded**: Visual organization by mode and platform
- **⏰ Time Stamps**: See when each analysis was performed

### Usage

1. **View History**: Open the extension popup - history shown at top
2. **Copy Result**: Click the "📋 Copy" button on any entry
3. **View Full**: Click the "👁️ View" button to see complete response
4. **Delete**: Click "🗑️ Delete" to remove specific entry
5. **Clear All**: Click "🗑️ Clear" in header to remove all history

### Storage

- Keeps last **100 entries** automatically
- Shows **20 most recent** in popup
- Stored **locally** in Chrome (never synced)
- **User controlled** - delete anytime

**See [HISTORY_FEATURE.md](./HISTORY_FEATURE.md) for complete documentation.**

## 🔧 Configuration

### API Integration

The extension requires an AI API key. Currently supported:

- OpenAI GPT-4 Vision API
- Google Gemini API
- Anthropic Claude API
- Custom backend integration

**To integrate your API:**

Edit `background.js` and update the `processWithAI()` function:

```javascript
async function processWithAI(input, apiKey) {
  // Example: OpenAI Integration
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  // Process and return result
}
```

## 🧪 Testing Your API Keys

Before using the extension, test your API keys to ensure they work correctly:

### Quick Test

```bash
# Run the interactive testing script
node test_apis.js
```

The script will:

- ✅ Validate your API key format
- 🔌 Test connectivity to each platform
- 💬 Verify responses are working
- 📊 Show token usage and costs

### Testing Documentation

- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Complete testing guide
- **[API_TEST_QUICK_REF.txt](./API_TEST_QUICK_REF.txt)** - Quick reference card
- **[test_apis_demo.js](./test_apis_demo.js)** - Programmatic testing examples

### What Gets Tested

Each platform test includes:

| Test Step         | What It Checks                                              |
| ----------------- | ----------------------------------------------------------- |
| Format Validation | Key starts with correct prefix and matches expected pattern |
| API Connection    | Can reach the API endpoint and authenticate successfully    |
| Response Quality  | Sends a simple math question and verifies the answer        |
| Token Usage       | Reports how many tokens were used (cost tracking)           |

### Example Output

```
Testing OpenAI
================================================================

Step 1: Validating API key format...
✅ Key format is valid

Step 2: Testing API connection...
ℹ️  Testing OpenAI API...
✅ OpenAI responded: "4"
ℹ️  Model: gpt-4o-mini
ℹ️  Tokens used: 25

✨ OpenAI is working correctly!
```

### Troubleshooting

If a test fails, the script provides:

- ❌ Clear error messages
- 💡 Platform-specific troubleshooting tips
- 🔗 Direct links to verify/manage your API keys
- 💰 Links to check your credits/billing

See [API_FIX_GUIDE.md](./API_FIX_GUIDE.md) for detailed troubleshooting.

## 📁 Project Structure

```
smart_lens_ai/
├── manifest.json              # Extension configuration
├── popup.html                # Extension popup interface
├── popup.css                 # Popup styles
├── popup.js                  # Popup logic & multi-platform key management
├── content.js                # Content script (page interaction)
├── content.css               # Content styles
├── background.js             # Service worker (AI processing, multi-platform)
├── icons/                    # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── test_apis.js              # 🧪 API testing script (interactive)
├── test_apis_demo.js         # 📝 Testing examples (programmatic)
├── README.md                 # Main documentation
├── QUICKSTART.md             # 5-minute setup guide
├── MULTI_PLATFORM_GUIDE.md   # Multi-platform feature guide
├── API_TESTING_GUIDE.md      # Complete testing documentation
├── API_TEST_QUICK_REF.txt    # Quick reference card
└── API_FIX_GUIDE.md          # Troubleshooting guide
```

## 🎨 Customization

### Adding New Modes

Edit `popup.html` to add new mode buttons:

```html
<button class="mode-btn" data-mode="translate">🌐 Translate</button>
```

### Modifying System Prompt

Edit the `SYSTEM_PROMPT` in `background.js` to adjust AI behavior.

## 🔒 Privacy & Security

- All processing happens via secure API calls
- No data is stored without user consent
- API keys are stored locally in Chrome storage
- Screen captures are processed in memory only

## 🐛 Troubleshooting

**Issue**: Extension icon doesn't appear

- Solution: Reload the extension from `chrome://extensions/`

**Issue**: "API key not configured" error

- Solution: Add your API key in the extension popup settings

**Issue**: "No text selected" error

- Solution: ✅ **FIXED!** Make sure to reload the extension. Select text, then click the "Analyze Selected Text" button. See [TEXT_SELECTION_FIX.md](./TEXT_SELECTION_FIX.md) for details.

**Issue**: Capture overlay doesn't show

- Solution: Refresh the webpage and try again

**Issue**: AI responses are generic

- Solution: Ensure you've integrated a real AI API in `background.js`

**Issue**: Text selection not working after update

- Solution: Reload the extension at `chrome://extensions/` and refresh all open tabs

## 🚧 Development Roadmap

- [ ] Integrate OpenAI GPT-4 Vision API
- [ ] Add Google Gemini API support
- [ ] Implement audio transcript analysis
- [ ] Add multi-AI fusion mode (GPT + Gemini)
- [ ] Create settings page for advanced configuration
- [ ] Add export/history features
- [ ] Support for more languages
- [ ] Offline mode with local AI models

## 📄 License

This project is open source. Feel free to modify and distribute.

## 👨‍💻 Author

SmartLens AI - Multimodal Autonomous Reasoning Agent

---

**Ready to use SmartLens AI!** 🚀
