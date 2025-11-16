# 🎯 SmartLens AI - Visual User Guide

## 🖼️ Interface Overview

```
┌─────────────────────────────────────────┐
│  🔍 SmartLens AI                    [×] │  ← Extension Popup
│  Multimodal Autonomous Reasoning Agent  │
├─────────────────────────────────────────┤
│                                         │
│  Select Mode                            │
│  ┌──────────┐ ┌──────────┐            │
│  │🤖 Auto   │ │✍️ Grammar│            │
│  │ Detect   │ │          │            │
│  └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐            │
│  │🧠 Solve  │ │📝 Summarize│           │
│  │ Question │ │          │            │
│  └──────────┘ └──────────┘            │
│  ┌──────────┐                          │
│  │💡 Explain│                          │
│  └──────────┘                          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📸 Capture Screen Area          │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  📋 Analyze Selected Text        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  API Settings                           │
│  ┌───────────────────────────────────┐ │
│  │ Enter your API key                │ │
│  └───────────────────────────────────┘ │
│  ┌─────────┐                           │
│  │  Save   │                           │
│  └─────────┘                           │
└─────────────────────────────────────────┘
```

---

## 📸 Screen Capture Mode

### Step 1: Activate Capture

```
Click extension icon → Select mode → Click "📸 Capture Screen Area"
```

### Step 2: Select Area

```
┌─────────────────────────────────────────────────┐
│  Screen with semi-transparent overlay          │
│                                                 │
│  🔍 SmartLens AI: Click and drag to select    │
│      area. Press ESC to cancel.                │
│                                                 │
│    ┌──────────────────────┐                   │
│    │  This is the question │  ← User drags    │
│    │  What is 2 + 2 = ?   │     to select     │
│    └──────────────────────┘                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Step 3: View Results

```
┌─────────────────────────────────────────────────┐
│  🔍 SmartLens AI Results                   [×] │
├─────────────────────────────────────────────────┤
│                                                 │
│  🎯 Detected Task                              │
│  Math problem solving                          │
│                                                 │
│  ⚡ Action Taken                               │
│  Solving basic arithmetic question             │
│                                                 │
│  ✨ Result                                      │
│  ┌─────────────────────────────────────────┐  │
│  │ Solution:                                │  │
│  │ 2 + 2 = 4                               │  │
│  │                                          │  │
│  │ Final Answer: 4                         │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  📝 Notes                                       │
│  Basic addition problem                        │
│                                                 │
├─────────────────────────────────────────────────┤
│  [📋 Copy Result]          SmartLens AI v1.0  │
└─────────────────────────────────────────────────┘
```

---

## 📋 Text Analysis Mode

### Method 1: Extension Button

```
1. Select text on webpage
2. Click extension icon
3. Click "📋 Analyze Selected Text"
4. View results
```

### Method 2: Context Menu

```
1. Select text on webpage
2. Right-click
3. Choose "🔍 Analyze with SmartLens AI"
4. View results
```

### Example Flow

```
Webpage Text:
┌─────────────────────────────────────┐
│ "This sentence have many mistake    │  ← User selects
│  and it need fix."                  │     this text
└─────────────────────────────────────┘
         ↓
    Right-click
         ↓
┌─────────────────────────────────────┐
│ Copy                                │
│ Cut                                 │
│ Paste                               │
│ ──────────────────────────────────  │
│ 🔍 Analyze with SmartLens AI    ✓  │  ← Click here
└─────────────────────────────────────┘
         ↓
    View Result
```

---

## 🎨 Mode Descriptions

### 🤖 Auto Detect (Default)

- Automatically identifies the task
- No manual selection needed
- Works with any input type
- **Use when:** You're not sure what you need

### ✍️ Grammar

- Corrects spelling and grammar
- Improves sentence structure
- Provides explanations
- **Use when:** Writing emails, essays, documents

### 🧠 Solve Question

- Step-by-step problem solving
- Works with math, science, any subject
- Shows reasoning process
- **Use when:** Homework, quizzes, practice problems

### 📝 Summarize

- Condenses long text
- Extracts key points
- Creates brief overview
- **Use when:** Reading articles, research papers

### 💡 Explain

- Teaching mode
- Simplifies complex concepts
- Educational tone
- **Use when:** Learning new topics

---

## 🔧 Settings & Configuration

### Adding API Key

```
Extension Popup → API Settings Section
┌─────────────────────────────────────┐
│ API Settings                        │
│ ┌───────────────────────────────┐  │
│ │ sk-abc123...                  │  │ ← Paste key here
│ └───────────────────────────────┘  │
│ [ Save ]  ← Click to save           │
└─────────────────────────────────────┘

Status appears:
"✅ API key saved successfully!"
```

### Where to Get API Keys

```
OpenAI (GPT-4):
→ https://platform.openai.com/api-keys

Google Gemini:
→ https://makersuite.google.com/app/apikey

Anthropic Claude:
→ https://console.anthropic.com/
```

---

## 📊 Response Format

### Standard Output Structure

```
┌─────────────────────────────────────┐
│ [Detected Task]: Grammar correction │
│                                     │
│ [Action Taken]:                     │
│ Analyzing sentence for grammatical  │
│ errors and providing corrections    │
│                                     │
│ [Result]:                           │
│ Corrected Text:                     │
│ This sentence has many mistakes...  │
│                                     │
│ Explanation:                        │
│ - "have" → "has" (subject-verb)    │
│ - "mistake" → "mistakes" (plural)  │
│                                     │
│ [Optional Notes]:                   │
│ Alternative version suggested       │
└─────────────────────────────────────┘
```

---

## 🎬 Usage Scenarios

### Scenario 1: Student Homework

```
Input: Screenshot of math problem
Mode: Auto Detect (or Solve Question)
Output: Step-by-step solution with final answer
```

### Scenario 2: Email Writing

```
Input: "im writng to ask about the job"
Mode: Grammar
Output: "I'm writing to ask about the job"
         + explanation of corrections
```

### Scenario 3: Reading Articles

```
Input: Select long article text
Mode: Summarize
Output: 3-5 sentence summary of key points
```

### Scenario 4: Learning

```
Input: "What is quantum entanglement?"
Mode: Explain
Output: Simple, educational explanation
```

### Scenario 5: MCQ Questions

```
Input: Screenshot of multiple choice question
Mode: Auto Detect
Output: Correct answer + reasoning
```

---

## ⌨️ Keyboard Shortcuts

```
Capture Mode:
- Click & Drag → Select area
- ESC → Cancel capture
- Click overlay → Cancel

Result Window:
- ESC → Close window
- Click outside → Close window
- Click [×] → Close window
```

---

## 🔔 Notification Types

### Success (Green)

```
┌──────────────────────────────┐
│ ✅ API key saved!           │
└──────────────────────────────┘
```

### Info (Blue)

```
┌──────────────────────────────┐
│ 🧠 Analyzing text...        │
└──────────────────────────────┘
```

### Error (Red)

```
┌──────────────────────────────┐
│ ❌ Error processing request │
└──────────────────────────────┘
```

### Warning (Orange)

```
┌──────────────────────────────┐
│ ⚠️  API key not configured  │
└──────────────────────────────┘
```

---

## 🎯 Best Practices

### ✅ DO:

- Use Auto Detect for general tasks
- Select clear, complete text
- Capture readable screen areas
- Save API key in extension
- Test with simple inputs first

### ❌ DON'T:

- Capture tiny or blurry text
- Expect results without API key
- Select incomplete sentences
- Use on sensitive/private data
- Ignore error messages

---

## 🆘 Common Issues & Solutions

### Issue: Extension icon not showing

```
Solution:
1. Go to chrome://extensions/
2. Find SmartLens AI
3. Click refresh icon 🔄
4. Check that it's enabled ✓
```

### Issue: Capture overlay doesn't appear

```
Solution:
1. Refresh the webpage (F5)
2. Click extension icon again
3. Try on a different page
```

### Issue: Generic/placeholder responses

```
Solution:
1. Add API key in extension
2. Integrate API code in background.js
3. See API_INTEGRATION_EXAMPLES.js
```

### Issue: "API key not configured"

```
Solution:
1. Click extension icon
2. Scroll to API Settings
3. Enter your API key
4. Click "Save" button
```

---

## 📱 Mobile / Small Screens

```
Extension adapts to screen size:
- Popup width adjusts
- Buttons stack vertically on small screens
- Result overlay scales appropriately
- Touch-friendly interface
```

---

## 🎨 Color Scheme

```
Primary: #667eea (Purple-Blue)
Secondary: #764ba2 (Deep Purple)
Success: #4caf50 (Green)
Error: #f44336 (Red)
Info: #2196f3 (Blue)
Warning: #ff9800 (Orange)

Gradient: 135deg, #667eea → #764ba2
```

---

## 📈 Future Features (Roadmap)

```
Coming Soon:
□ Audio transcript analysis
□ Multi-language support
□ History of analyses
□ Export to PDF/TXT
□ Custom system prompts
□ Offline mode
□ Team collaboration
□ Browser sync
```

---

## 🎓 Tips & Tricks

### Tip 1: Fast Access

```
Pin extension to toolbar:
chrome://extensions/ → Pin icon 📌
```

### Tip 2: Quick Grammar Check

```
Select text → Right-click → SmartLens
Faster than opening popup!
```

### Tip 3: Mode Persistence

```
Extension remembers your last selected mode
No need to change it every time
```

### Tip 4: Copy Results

```
Click "📋 Copy Result" in result window
Paste anywhere instantly
```

### Tip 5: Multiple Captures

```
You can capture multiple areas
Each shows in a new result window
```

---

**Ready to use SmartLens AI? 🚀**

See `QUICKSTART.md` for installation steps!
