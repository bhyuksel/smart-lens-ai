# ✅ SmartLens AI - First-Time Setup Checklist

## Before You Start

- [ ] You have Node.js installed (`node --version` should work)
- [ ] You have Chrome or Chromium browser
- [ ] You have at least ONE API key ready (or will get one)

---

## 🎯 Setup Steps (Check off as you complete)

### Step 1: Test Your API Keys (5 minutes)

- [ ] Open terminal in project folder
- [ ] Run: `cd /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai`
- [ ] Run: `node test_apis.js`
- [ ] Follow prompts to test each platform
- [ ] At least ONE platform tests successfully ✅

**Stuck?** Read [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)

---

### Step 2: Load Extension in Chrome (2 minutes)

- [ ] Open Chrome browser
- [ ] Go to: `chrome://extensions/`
- [ ] Enable "Developer mode" (toggle in top-right corner)
- [ ] Click "Load unpacked" button
- [ ] Navigate to: `/home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai`
- [ ] Click "Select Folder"
- [ ] SmartLens AI appears in your extensions ✅

**Stuck?** Read [QUICKSTART.md](./QUICKSTART.md)

---

### Step 3: Add Your API Key (1 minute)

- [ ] Click the SmartLens AI extension icon in Chrome toolbar
- [ ] Select a platform from the dropdown (e.g., "OpenAI")
- [ ] Paste your API key in the input field
- [ ] Click "Save API Key"
- [ ] See green "✅ API key saved!" message
- [ ] Your key appears in "Saved Platforms" section
- [ ] Click "Use" button next to your key
- [ ] See "(Active)" badge next to your key ✅

**Stuck?** Read [MULTI_PLATFORM_GUIDE.md](./MULTI_PLATFORM_GUIDE.md)

---

### Step 4: Test the Extension (3 minutes)

#### Test 4A: Text Analysis

- [ ] Open any webpage with text
- [ ] Select some text
- [ ] Click SmartLens AI icon
- [ ] Click "📋 Analyze Selected Text"
- [ ] See loading indicator
- [ ] Get AI analysis result ✅

#### Test 4B: Screen Capture

- [ ] Click SmartLens AI icon
- [ ] Click "📸 Capture Screen Area"
- [ ] Click and drag to select screen area
- [ ] Release mouse button
- [ ] See loading indicator
- [ ] Get AI analysis result ✅

#### Test 4C: Context Menu

- [ ] Select text on any webpage
- [ ] Right-click on the selection
- [ ] Click "🔍 Analyze with SmartLens AI"
- [ ] Get AI analysis result ✅

**Stuck?** Read [VISUAL_GUIDE.md](./VISUAL_GUIDE.md)

---

## 🎓 Optional: Learn More

### Understanding the Features

- [ ] Read [README.md](./README.md) for full feature list
- [ ] Read [COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md) for comprehensive overview
- [ ] Try all 5 analysis modes (Auto, Grammar, Solve, Summarize, Explain)

### Platform Management

- [ ] Add keys for multiple platforms
- [ ] Switch between platforms using "Use" button
- [ ] Compare response quality between platforms
- [ ] Review cost information in [COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md)

### Troubleshooting

- [ ] Bookmark [API_FIX_GUIDE.md](./API_FIX_GUIDE.md) for future reference
- [ ] Keep [API_TEST_QUICK_REF.txt](./API_TEST_QUICK_REF.txt) handy
- [ ] Know where to check credits:
  - OpenAI: https://platform.openai.com/account/billing
  - Claude: https://console.anthropic.com/settings/billing
  - Gemini: Free tier (60 req/min)
  - OpenRouter: https://openrouter.ai/credits

---

## 🚨 Common First-Time Issues

### Issue: "No response from AI"

**Checklist**:

- [ ] API key is saved? (Check "Saved Platforms" section)
- [ ] Platform is active? (Should see "(Active)" badge)
- [ ] Have credits? (Check platform billing page)
- [ ] Tested with `node test_apis.js`? (Should pass)

### Issue: "Invalid API key format"

**Checklist**:

- [ ] Copied entire key? (No spaces, complete string)
- [ ] Correct platform selected? (OpenAI key with OpenAI platform)
- [ ] Key format matches pattern?
  - OpenAI: `sk-proj-...` or `sk-...`
  - Claude: `sk-ant-...`
  - Gemini: `AIza...`
  - OpenRouter: `sk-or-v1-...`

### Issue: "Screen capture not working"

**Checklist**:

- [ ] Refreshed the webpage?
- [ ] Extension is loaded? (Check chrome://extensions)
- [ ] Different website? (Some sites block scripts)
- [ ] Console errors? (Right-click → Inspect → Console)

---

## 📊 Success Criteria

You're ready to use SmartLens AI when:

✅ At least ONE platform tested successfully with `node test_apis.js`  
✅ Extension loaded in Chrome (visible in chrome://extensions)  
✅ At least ONE API key saved and active  
✅ Successfully analyzed text OR captured screen area  
✅ Received AI response without errors

**All checked?** 🎉 **You're all set!** Start using SmartLens AI!

---

## 🎯 Quick Reference

### Where to Get API Keys

| Platform   | URL                                         | Cost    |
| ---------- | ------------------------------------------- | ------- |
| **Gemini** | https://makersuite.google.com/app/apikey    | FREE ⭐ |
| OpenAI     | https://platform.openai.com/api-keys        | $5 min  |
| Claude     | https://console.anthropic.com/settings/keys | Paid    |
| OpenRouter | https://openrouter.ai/keys                  | $5 min  |

💡 **First timer?** Get a Gemini key - it's completely free!

### Key Commands

```bash
# Test all APIs
node test_apis.js

# See testing demo
node test_apis_demo.js

# Verify files
./test.sh

# Quick API check
./verify_api.sh
```

### Key Files to Know

- **README.md** - Feature overview
- **QUICKSTART.md** - 5-minute setup
- **COMPLETE_GUIDE.md** - Everything you need
- **API_TESTING_GUIDE.md** - Testing help
- **API_FIX_GUIDE.md** - Troubleshooting

---

## 📞 Need Help?

1. **Check documentation first**: 12 guides in this folder
2. **Run diagnostics**: `node test_apis.js`
3. **Read error messages**: They contain helpful info
4. **Check console**: Right-click extension → Inspect → Console

---

## 🎓 Learning Path

### Beginner (Day 1)

1. ✅ Complete this checklist
2. ✅ Read [QUICKSTART.md](./QUICKSTART.md)
3. ✅ Try each feature once

### Intermediate (Week 1)

1. ✅ Read [COMPLETE_GUIDE.md](./COMPLETE_GUIDE.md)
2. ✅ Add multiple platforms
3. ✅ Compare platform responses
4. ✅ Understand cost structure

### Advanced (Month 1)

1. ✅ Read [MULTI_PLATFORM_GUIDE.md](./MULTI_PLATFORM_GUIDE.md)
2. ✅ Customize for your workflow
3. ✅ Optimize costs
4. ✅ Consider contributing improvements

---

## 🎉 Congratulations!

When you complete this checklist, you'll have:

- ✅ Working API integration
- ✅ Chrome extension installed
- ✅ Tested all key features
- ✅ Know where to get help

**Start your checklist now!** 🚀

---

**Last Updated**: December 2024  
**Estimated Time**: 15-20 minutes total  
**Difficulty**: Beginner-friendly

_Questions? Check the documentation files in this folder!_
