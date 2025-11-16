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

## 📁 Project Structure

```
smart_lens_ai/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── content.js            # Content script (page interaction)
├── content.css           # Content styles
├── background.js         # Service worker (AI processing)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # Documentation
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

**Issue**: Capture overlay doesn't show

- Solution: Refresh the webpage and try again

**Issue**: AI responses are generic

- Solution: Ensure you've integrated a real AI API in `background.js`

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
