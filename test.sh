#!/bin/bash

# SmartLens AI - Testing Script
# Run this to verify everything is set up correctly

echo "🔍 SmartLens AI - System Check"
echo "================================"
echo ""

PROJECT_DIR="/home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai"
cd "$PROJECT_DIR"

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Not in project directory"
    exit 1
fi

echo "✅ Project directory found"
echo ""

# Check core files
echo "📁 Checking core files..."
files=("manifest.json" "popup.html" "popup.js" "popup.css" "content.js" "content.css" "background.js")
missing=0

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - MISSING"
        missing=$((missing + 1))
    fi
done

echo ""

# Check icons
echo "🎨 Checking icons..."
icons=("icons/icon16.png" "icons/icon48.png" "icons/icon128.png")
icon_missing=0

for icon in "${icons[@]}"; do
    if [ -f "$icon" ]; then
        echo "  ✅ $icon"
    else
        echo "  ⚠️  $icon - Missing (optional)"
        icon_missing=$((icon_missing + 1))
    fi
done

echo ""

# Check documentation
echo "📚 Checking documentation..."
docs=("README.md" "QUICKSTART.md" "PROJECT_SUMMARY.md" "API_INTEGRATION_EXAMPLES.js")

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc - MISSING"
    fi
done

echo ""
echo "================================"
echo "Summary:"
echo "================================"

if [ $missing -eq 0 ]; then
    echo "✅ All core files present"
else
    echo "⚠️  $missing core file(s) missing"
fi

if [ $icon_missing -eq 0 ]; then
    echo "✅ All icons present"
else
    echo "⚠️  $icon_missing icon(s) missing (create them or use placeholders)"
fi

echo ""
echo "📋 Next Steps:"
echo "================================"
echo ""
echo "1. Install in Chrome:"
echo "   → Open: chrome://extensions/"
echo "   → Enable 'Developer mode'"
echo "   → Click 'Load unpacked'"
echo "   → Select: $PROJECT_DIR"
echo ""

if [ $icon_missing -gt 0 ]; then
    echo "2. Create icons (optional):"
    echo "   → Run: ./setup.sh"
    echo "   → Or add PNG files manually to icons/"
    echo ""
fi

echo "3. Test the extension:"
echo "   → Click the extension icon"
echo "   → Try 'Auto Detect' mode"
echo "   → Select text and analyze"
echo ""
echo "4. Add API integration:"
echo "   → Get API key from OpenAI/Gemini/Claude"
echo "   → Add key in extension popup"
echo "   → Copy code from API_INTEGRATION_EXAMPLES.js"
echo "   → Paste into background.js"
echo ""
echo "✨ SmartLens AI is ready!"
echo ""
echo "Need help? Read QUICKSTART.md"
