# 🔬 SmartLens AI - API Testing Guide

## Overview

The `test_apis.js` script is a comprehensive testing tool that validates your API keys for all supported platforms. It checks key format, connectivity, and response quality with color-coded terminal output.

## Supported Platforms

| Platform             | Models Tested        | Key Format     |
| -------------------- | -------------------- | -------------- |
| **OpenAI**           | GPT-4o, GPT-4o-mini  | `sk-...`       |
| **Anthropic Claude** | Claude 3.5 Sonnet    | `sk-ant-...`   |
| **Google Gemini**    | Gemini 2.5 Pro/Flash | `AIza...`      |
| **OpenRouter**       | Multi-model proxy    | `sk-or-v1-...` |

## Quick Start

### 1. Run the Interactive Test

```bash
cd /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai
node test_apis.js
```

Or make it executable and run directly:

```bash
chmod +x test_apis.js
./test_apis.js
```

### 2. Follow the Prompts

The script will prompt you for each platform's API key:

```
🔬 SmartLens AI - Multi-Platform API Testing Script
================================================================

OpenAI
Expected format: sk-...
Enter your OpenAI API key (or press Enter to skip):
```

- **Enter your key** to test that platform
- **Press Enter** to skip that platform

### 3. View Results

The script will display:

- ✅ Key format validation
- 🔌 API connectivity test
- 💬 Sample response from the model
- 📊 Token usage statistics
- 📋 Summary report

## Example Output

```
Testing OpenAI

Step 1: Validating API key format...
✅ Key format is valid

Step 2: Testing API connection...

ℹ️  Testing OpenAI API...
✅ OpenAI responded: "4"
ℹ️  Model: gpt-4o-mini
ℹ️  Tokens used: 25

✨ OpenAI is working correctly!
```

## What Each Test Does

### 1. **Format Validation**

- Checks if the key starts with the correct prefix
- Validates the key length and pattern
- Ensures no whitespace or invalid characters

### 2. **API Connection Test**

- Sends a simple math question: "What is 2 + 2?"
- Uses minimal tokens to reduce costs
- Verifies the API is accessible and responding

### 3. **Response Quality Check**

- Validates the response structure
- Extracts the actual answer
- Reports token usage and model info

## Test Summary Report

After testing all platforms, you'll see:

```
📊 Test Summary
================================================================

Total platforms: 4
Tested: 3
Successful: 2
Failed: 1
Skipped: 1

✅ Working platforms:
   • OpenAI
   • Google Gemini

❌ Failed platforms:
   • Anthropic Claude: Invalid authentication

⏭️  Skipped platforms:
   • OpenRouter
```

## Troubleshooting Tips

### Platform-Specific Help

The script automatically provides troubleshooting tips for failed platforms:

#### OpenAI Failures

- **Verify key**: https://platform.openai.com/api-keys
- **Check billing**: https://platform.openai.com/account/billing
- **Add credits**: You need at least $5 to start
- **Common error**: "Incorrect API key provided"

#### Claude Failures

- **Verify key**: https://console.anthropic.com/settings/keys
- **Check usage**: https://console.anthropic.com/settings/usage
- **Credits needed**: Requires paid plan or prepaid credits
- **Common error**: "Invalid x-api-key"

#### Gemini Failures

- **Get API key**: https://makersuite.google.com/app/apikey
- **Free tier limits**: 60 requests per minute
- **Enable API**: Check Google Cloud Console settings
- **Common error**: "API_KEY_INVALID"

#### OpenRouter Failures

- **Verify key**: https://openrouter.ai/keys
- **Check credits**: https://openrouter.ai/credits
- **Add balance**: Minimum $5 recommended
- **Common error**: "Insufficient credits"

## Common Issues

### Issue: "Key format is invalid"

**Solution**: Double-check you copied the entire key without extra spaces

```bash
# Wrong (has spaces)
sk-proj-abc  def

# Correct
sk-proj-abcdef
```

### Issue: "Connection timeout"

**Solution**:

- Check your internet connection
- Verify firewall isn't blocking HTTPS requests
- Try again in a few seconds

### Issue: "Rate limit exceeded"

**Solution**:

- Wait 60 seconds and try again
- Some platforms have strict rate limits on free tier

### Issue: "Insufficient credits"

**Solution**:

- OpenAI: Add billing at https://platform.openai.com/account/billing
- Claude: Add credits at https://console.anthropic.com/settings/billing
- OpenRouter: Add balance at https://openrouter.ai/credits

## Advanced Usage

### Test Only One Platform

You can skip unwanted platforms by pressing Enter:

```bash
node test_apis.js
# Press Enter for OpenAI
# Press Enter for Claude
# Enter Gemini key
# Press Enter for OpenRouter
```

### Programmatic Usage

Import the functions in your own Node.js scripts:

```javascript
const { testOpenAI, testClaude, validateKeyFormat } = require("./test_apis.js");

// Validate a key format
const validation = validateKeyFormat("openai", "sk-abc123");
console.log(validation.valid); // true/false

// Test a platform
const result = await testOpenAI("sk-your-key-here");
console.log(result.success); // true/false
```

## Cost Information

Each test uses minimal tokens (approximately):

| Platform                 | Tokens | Estimated Cost |
| ------------------------ | ------ | -------------- |
| OpenAI GPT-4o-mini       | ~25    | $0.00001       |
| Claude 3.5 Sonnet        | ~30    | $0.0001        |
| Gemini 2.5 Flash         | ~25    | FREE           |
| OpenRouter (GPT-4o-mini) | ~25    | $0.00001       |

**Total cost for testing all platforms: < $0.001 (less than 1 cent)**

## Test Frequency Recommendations

- **First time setup**: Test all platforms
- **Adding new key**: Test just that platform
- **After API errors**: Re-test the failing platform
- **Monthly check**: Verify all keys still work

## Next Steps After Testing

### ✅ All Tests Passed

1. Reload your Chrome extension
2. Open the SmartLens AI popup
3. Your API keys are ready to use!

### ⚠️ Some Tests Failed

1. Fix the failing platforms using troubleshooting tips
2. Re-run the test script
3. Use working platforms in the meantime

### ❌ All Tests Failed

1. Verify your internet connection
2. Check if you copied keys correctly
3. Ensure you have credits/billing set up
4. Try again in a few minutes

## Color Legend

- 🟢 **Green**: Success, working correctly
- 🔴 **Red**: Error, something failed
- 🟡 **Yellow**: Warning or skipped
- 🔵 **Blue**: Information
- 🟣 **Magenta**: Claude-specific messages
- 🟦 **Cyan**: OpenRouter-specific messages

## Example Test Session

```bash
$ node test_apis.js

🔬 SmartLens AI - Multi-Platform API Testing Script
================================================================

OpenAI
Expected format: sk-...
Enter your OpenAI API key (or press Enter to skip): sk-proj-abc123...

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

[... similar for other platforms ...]

📊 Test Summary
================================================================

Total platforms: 4
Tested: 2
Successful: 2
Failed: 0
Skipped: 2

✅ Working platforms:
   • OpenAI
   • Google Gemini

⏭️  Skipped platforms:
   • Anthropic Claude
   • OpenRouter

✨ You can use SmartLens AI with the working platforms!
```

## Files Updated

This testing script works with:

- `test_apis.js` - Main testing script
- `background.js` - API integrations being tested
- `popup.js` - Key management UI

## Support

If you encounter issues not covered here:

1. Check the [API_FIX_GUIDE.md](./API_FIX_GUIDE.md) for general API troubleshooting
2. Review [MULTI_PLATFORM_GUIDE.md](./MULTI_PLATFORM_GUIDE.md) for platform details
3. Read platform-specific documentation:
   - [OpenAI Docs](https://platform.openai.com/docs)
   - [Claude Docs](https://docs.anthropic.com)
   - [Gemini Docs](https://ai.google.dev/docs)
   - [OpenRouter Docs](https://openrouter.ai/docs)

---

**Ready to test?** Run `node test_apis.js` now! 🚀
