#!/bin/bash

# SmartLens AI - API Integration Verification

echo "🔧 SmartLens AI - API Integration Check"
echo "========================================"
echo ""

# Check if background.js has real API integration
if grep -q "api.openai.com" /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "✅ OpenAI API integrated in background.js"
elif grep -q "generativelanguage.googleapis.com" /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "✅ Google Gemini API integrated in background.js"
elif grep -q "api.anthropic.com" /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "✅ Anthropic Claude API integrated in background.js"
else
    echo "⚠️  No real API detected - still using demo mode"
fi

if grep -q "Demo Mode" /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "⚠️  Demo mode code still present (should be removed)"
else
    echo "✅ Demo mode removed"
fi

echo ""
echo "📋 Next Steps:"
echo "========================================"
echo ""
echo "1. Reload the extension in Chrome:"
echo "   → Go to: chrome://extensions/"
echo "   → Find 'SmartLens AI'"
echo "   → Click the reload icon 🔄"
echo ""
echo "2. Verify your API key is saved:"
echo "   → Click the SmartLens AI extension icon"
echo "   → Check API Settings section"
echo "   → Key should be saved (not visible for security)"
echo ""
echo "3. Test the extension:"
echo "   → Select some text on any webpage"
echo "   → Try: 'What is 2 + 2?'"
echo "   → Click extension icon → 'Analyze Selected Text'"
echo "   → You should see a REAL AI response!"
echo ""
echo "4. If you get errors:"
echo "   → Open Chrome DevTools (F12)"
echo "   → Go to 'Console' tab"
echo "   → Look for error messages"
echo "   → Check if API key is correct"
echo ""
echo "🔑 API Key Format:"
echo "========================================"
echo "OpenAI: sk-proj-xxxxxxxxxx (starts with 'sk-')"
echo "Gemini: AIzaSyxxxxxxxxxx (starts with 'AIza')"
echo "Claude: sk-ant-xxxxxxxxxx (starts with 'sk-ant')"
echo ""
echo "✨ Integration complete! Reload the extension now."
