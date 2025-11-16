# 🎉 Multi-Platform API Support - User Guide

## ✨ What's New

SmartLens AI now supports **4 different AI platforms**! You can:

- ✅ Add API keys for multiple platforms
- ✅ Switch between platforms instantly
- ✅ View all saved API keys
- ✅ Delete API keys you no longer need
- ✅ See which platform is currently active

---

## 🔑 Supported Platforms

### 1. **OpenAI (GPT-4o)** 🤖

- **Models**: GPT-4o (images), GPT-4o-mini (text)
- **Cost**: ~$0.005 per request
- **Best for**: General use, great quality
- **API Key**: Get at https://platform.openai.com/api-keys
- **Format**: Starts with `sk-`

### 2. **Anthropic Claude** 🧠

- **Models**: Claude 3.5 Sonnet
- **Cost**: ~$0.015 per request
- **Best for**: Long-form analysis, coding
- **API Key**: Get at https://console.anthropic.com
- **Format**: Starts with `sk-ant-`

### 3. **Google Gemini** 📱

- **Models**: Gemini 1.5 Pro (images), 1.5 Flash (text)
- **Cost**: FREE tier available!
- **Best for**: Budget-friendly, fast responses
- **API Key**: Get at https://makersuite.google.com/app/apikey
- **Format**: Starts with `AIza`

### 4. **OpenRouter** 🌐

- **Models**: Access to multiple models
- **Cost**: Pay-as-you-go
- **Best for**: Accessing various models
- **API Key**: Get at https://openrouter.ai/keys
- **Format**: Starts with `sk-or-`

---

## 🚀 How to Use

### Step 1: Add Your First API Key

1. **Click the SmartLens AI extension icon**
2. **Scroll to "🔑 API Configuration"**
3. **Select a platform** from the dropdown:

   - OpenAI (GPT-4o)
   - Anthropic Claude
   - Google Gemini
   - OpenRouter

4. **Enter your API key** for that platform
5. **Click "💾 Save API Key"**

### Step 2: Add More Platforms (Optional)

You can add API keys for multiple platforms:

1. **Select a different platform** from the dropdown
2. **Enter that platform's API key**
3. **Click "💾 Save API Key"**
4. Repeat for as many platforms as you want!

### Step 3: Switch Between Platforms

In the **"Saved Platforms"** section:

- **Active platform** is highlighted in blue
- Click **"Use"** on any platform to switch to it
- The extension will now use that platform for all requests

### Step 4: Test It!

1. Go to any webpage
2. Select text: "What is 2 + 2?"
3. Click **"📋 Analyze Selected Text"**
4. You'll see a response from your active platform!

---

## 📋 UI Guide

### Platform Selector

```
Select Platform
┌─────────────────────────────┐
│ OpenAI (GPT-4o)         ▼  │ ← Dropdown menu
└─────────────────────────────┘
```

### API Key Input

```
API Key
┌─────────────────────────────┐
│ sk-proj-xxxxx               │ ← Enter key here
└─────────────────────────────┘

[💾 Save API Key]
```

### Saved Platforms List

```
Saved Platforms
┌─────────────────────────────────────┐
│ [OPENAI] sk-proj-•••••xxxx          │ ← Active (blue)
│          [✓ Active] [🗑️]            │
├─────────────────────────────────────┤
│ [GEMINI] AIza•••••yyyy              │
│          [Use] [🗑️]                 │
└─────────────────────────────────────┘
```

---

## 🎨 Visual Indicators

### Platform Badges

- 🟢 **OPENAI** - Green badge
- 🟠 **CLAUDE** - Orange badge
- 🔵 **GEMINI** - Blue badge
- 🟣 **OPENROUTER** - Purple badge

### Active Platform

- Blue highlighted background
- Shows "✓ Active" button
- This is the platform being used

### Inactive Platforms

- Gray background
- Shows "Use" button
- Click to switch to this platform

---

## 💡 Use Cases

### Scenario 1: Budget-Conscious

**Setup**: Add Gemini API key
**Why**: Free tier available
**Cost**: $0.00 for moderate use

### Scenario 2: Best Quality

**Setup**: Add OpenAI and Claude
**Why**: Switch based on task complexity
**Cost**: ~$0.005-0.015 per request

### Scenario 3: Multi-Model Comparison

**Setup**: Add all 4 platforms
**Why**: Test different models
**Usage**: Switch and compare responses

### Scenario 4: Backup Plan

**Setup**: Add OpenAI + Gemini
**Why**: If one hits rate limit, switch to other
**Benefit**: No downtime

---

## ⚙️ Technical Details

### API Key Storage

- Keys are stored **locally** in Chrome storage
- **Encrypted** by Chrome's secure storage
- Never sent to any server except the chosen AI platform
- Can be deleted anytime

### API Key Format Validation

The extension validates your API key format:

- **OpenAI**: Must start with `sk-`
- **Claude**: Must start with `sk-ant-`
- **Gemini**: Must start with `AIza`
- **OpenRouter**: Must start with `sk-or-`

### Platform Routing

When you analyze text/image:

1. Extension checks which platform is active
2. Retrieves that platform's API key
3. Sends request to that platform's API
4. Returns response in SmartLens format

---

## 🔒 Security & Privacy

### Your API Keys Are Safe

✅ Stored locally on your computer
✅ Encrypted by Chrome
✅ Never shared with anyone
✅ Only you can access them
✅ Can delete anytime

### What Gets Sent to AI

- Your selected text or captured image
- The mode you selected (auto, grammar, etc.)
- SmartLens system prompt

### What NEVER Gets Sent

- Your API keys (stays in browser)
- Your browsing history
- Other webpage content
- Personal information

---

## 🆘 Troubleshooting

### Issue: Can't Save API Key

**Error**: "API key format invalid"
**Solution**: Check the key format for your platform:

- OpenAI: sk-proj-xxxx or sk-xxxx
- Claude: sk-ant-api-xxxx
- Gemini: AIzaxxxx
- OpenRouter: sk-or-xxxx

### Issue: "No API key configured"

**Solution**:

1. Click extension icon
2. Check if platform is in "Saved Platforms"
3. Click "Use" to activate it
4. Try again

### Issue: Wrong Platform Responding

**Solution**:

1. Check "Saved Platforms" section
2. See which one shows "✓ Active"
3. Click "Use" on the platform you want
4. Try again

### Issue: Want to Remove a Platform

**Solution**:

1. Find the platform in "Saved Platforms"
2. Click the 🗑️ button
3. Confirm deletion
4. Key is permanently removed

---

## 💰 Cost Comparison

### Text Analysis (1000 requests)

| Platform   | Model       | Cost       | Free Tier |
| ---------- | ----------- | ---------- | --------- |
| Gemini     | 1.5 Flash   | $0 - $0.35 | ✅ Yes    |
| OpenAI     | GPT-4o-mini | $0.30      | ❌ No     |
| Claude     | 3.5 Sonnet  | $15.00     | ❌ No     |
| OpenRouter | Various     | Varies     | ❌ No     |

### Image Analysis (100 images)

| Platform   | Model      | Cost       | Free Tier |
| ---------- | ---------- | ---------- | --------- |
| Gemini     | 1.5 Pro    | $0 - $0.35 | ✅ Yes    |
| OpenAI     | GPT-4o     | $0.50      | ❌ No     |
| Claude     | 3.5 Sonnet | $1.50      | ❌ No     |
| OpenRouter | Various    | Varies     | ❌ No     |

---

## 🎯 Best Practices

### DO:

✅ Add at least 2 platforms (backup)
✅ Start with Gemini (free tier)
✅ Test each platform to see which you prefer
✅ Check your usage/costs regularly
✅ Delete old API keys you're not using

### DON'T:

❌ Share your API keys with anyone
❌ Use the same API key in multiple places
❌ Forget to check which platform is active
❌ Ignore rate limit errors
❌ Leave unused platforms configured

---

## 📊 Platform Comparison

| Feature | OpenAI       | Claude       | Gemini       | OpenRouter |
| ------- | ------------ | ------------ | ------------ | ---------- |
| Text    | ✅ Excellent | ✅ Excellent | ✅ Good      | ✅ Various |
| Vision  | ✅ Yes       | ✅ Yes       | ✅ Yes       | ✅ Yes     |
| Speed   | ⚡ Fast      | ⚡ Fast      | ⚡ Very Fast | ⚡ Varies  |
| Cost    | 💰 Low       | 💰💰 Medium  | 🆓 Free Tier | 💰 Varies  |
| Quality | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐     | ⭐ Varies  |

---

## 🔄 Migration from Old Version

### If You Used Single API Key Before

Your old API key is **still there**, but:

1. You need to re-add it in the new format
2. Select the platform (probably OpenAI)
3. Paste your key
4. Click "Save API Key"

The old storage format has been replaced with the new multi-platform system.

---

## 📚 Additional Resources

### Get API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Claude**: https://console.anthropic.com/account/keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **OpenRouter**: https://openrouter.ai/keys

### Check Usage/Costs

- **OpenAI**: https://platform.openai.com/usage
- **Claude**: https://console.anthropic.com/settings/usage
- **Gemini**: Free tier - no tracking needed
- **OpenRouter**: https://openrouter.ai/activity

### Documentation

- **OpenAI**: https://platform.openai.com/docs
- **Claude**: https://docs.anthropic.com
- **Gemini**: https://ai.google.dev/docs
- **OpenRouter**: https://openrouter.ai/docs

---

## ✅ Quick Start Checklist

- [ ] Open extension popup
- [ ] Select a platform from dropdown
- [ ] Enter API key for that platform
- [ ] Click "Save API Key"
- [ ] See it appear in "Saved Platforms"
- [ ] Confirm it shows "✓ Active"
- [ ] Test with simple text
- [ ] Add more platforms (optional)
- [ ] Switch between them to compare

---

## 🎉 You're All Set!

Your SmartLens AI extension now supports multiple AI platforms!

**Recommended First Steps:**

1. Start with **Gemini** (free tier)
2. Add **OpenAI** as backup
3. Test both to see which you prefer
4. Keep both configured for flexibility

**Need Help?**

- Check console (F12) for error messages
- Verify API key format
- Ensure platform is set to "Active"
- Try switching to a different platform

---

**Enjoy your multi-platform AI assistant! 🚀**
