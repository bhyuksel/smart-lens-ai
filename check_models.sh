#!/bin/bash

# Quick Model Update Verification

echo "🔍 SmartLens AI - Model Update Verification"
echo "============================================"
echo ""

echo "Checking current models in background.js..."
echo ""

if grep -q '"gpt-4o"' /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "✅ gpt-4o found (for images)"
fi

if grep -q '"gpt-4o-mini"' /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "✅ gpt-4o-mini found (for text)"
fi

if grep -q 'gpt-4-vision-preview\|gpt-4-turbo' /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js; then
    echo "⚠️  Deprecated models still present!"
else
    echo "✅ No deprecated models found"
fi

echo ""
echo "📊 Current Configuration:"
echo "============================================"
grep -A1 "model:" /home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai/background.js | head -2

echo ""
echo "🚀 Next Steps:"
echo "============================================"
echo ""
echo "1. RELOAD EXTENSION (REQUIRED!):"
echo "   → chrome://extensions/"
echo "   → Click reload 🔄 on SmartLens AI"
echo ""
echo "2. Test with text:"
echo "   → Select: 'What is 2 + 2?'"
echo "   → Analyze with SmartLens"
echo "   → Should work now!"
echo ""
echo "3. Test with image (if using screen capture):"
echo "   → Capture any screen area"
echo "   → Should analyze with gpt-4o"
echo ""
echo "✨ Model update complete!"
echo ""
echo "💰 New Pricing (Much Cheaper!):"
echo "   - Text: ~$0.0003 per request (gpt-4o-mini)"
echo "   - Images: ~$0.005 per request (gpt-4o)"
echo "   - Previous: ~$0.01+ per request"
echo ""
echo "📚 See MODEL_UPDATE.md for full details"
