#!/bin/bash

# SmartLens AI Extension Setup Script

echo "🔍 SmartLens AI - Project Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Create icons if ImageMagick is available
echo "📸 Checking for icon generation tools..."
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found. Creating icons..."
    cd icons
    
    # 16x16 icon
    convert -size 16x16 gradient:"#667eea-#764ba2" \
            -gravity center -pointsize 12 -fill white \
            -draw "circle 8,8 8,2" icon16.png
    
    # 48x48 icon
    convert -size 48x48 gradient:"#667eea-#764ba2" \
            -gravity center -pointsize 36 -fill white \
            -draw "circle 24,24 24,6" icon48.png
    
    # 128x128 icon
    convert -size 128x128 gradient:"#667eea-#764ba2" \
            -gravity center -pointsize 96 -fill white \
            -draw "circle 64,64 64,16" icon128.png
    
    cd ..
    echo "✅ Icons created successfully"
else
    echo "⚠️  ImageMagick not found. Please create icons manually in the icons/ folder."
    echo "   Required sizes: 16x16, 48x48, 128x128 pixels (PNG format)"
fi

echo ""
echo "📋 Next Steps:"
echo "================================"
echo ""
echo "1. Install the extension in Chrome:"
echo "   - Open Chrome and go to: chrome://extensions/"
echo "   - Enable 'Developer mode' (toggle in top-right)"
echo "   - Click 'Load unpacked'"
echo "   - Select this folder: $(pwd)"
echo ""
echo "2. Configure your API key:"
echo "   - Click the SmartLens AI extension icon"
echo "   - Enter your AI API key (OpenAI, Gemini, etc.)"
echo "   - Click 'Save'"
echo ""
echo "3. Integrate your AI API:"
echo "   - Edit background.js"
echo "   - Update the processWithAI() function"
echo "   - Add your API endpoint and processing logic"
echo ""
echo "4. Test the extension:"
echo "   - Visit any webpage"
echo "   - Click the extension icon"
echo "   - Try 'Capture Screen Area' or 'Analyze Selected Text'"
echo ""
echo "📚 Documentation: See README.md for full details"
echo ""
echo "✨ SmartLens AI is ready to use!"
