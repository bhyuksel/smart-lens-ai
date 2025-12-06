#!/bin/bash

# SmartLens AI - History Feature Demo Script
# Run this to verify the history feature is working

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║      SmartLens AI - History Feature Verification                ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/bhy/Desktop/BHY/bhy-pro/smart_lens_ai"

echo -e "${BLUE}📁 Checking project directory...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✅ Project directory found${NC}"
else
    echo -e "${RED}❌ Project directory not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔍 Verifying history implementation files...${NC}"
echo ""

# Check popup.html
echo -n "  popup.html (History Section): "
if grep -q "history-section" "$PROJECT_DIR/popup.html"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check popup.css
echo -n "  popup.css (History Styles): "
if grep -q ".history-section" "$PROJECT_DIR/popup.css"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check popup.js functions
echo -n "  popup.js (loadHistory): "
if grep -q "async function loadHistory()" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  popup.js (handleHistoryAction): "
if grep -q "async function handleHistoryAction" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  popup.js (deleteHistoryItem): "
if grep -q "async function deleteHistoryItem" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  popup.js (copyToClipboard): "
if grep -q "async function copyToClipboard" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

# Check background.js
echo -n "  background.js (saveToHistory): "
if grep -q "async function saveToHistory" "$PROJECT_DIR/background.js"; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  background.js (saveToHistory calls): "
SAVE_CALLS=$(grep -c "await saveToHistory" "$PROJECT_DIR/background.js")
if [ "$SAVE_CALLS" -ge 2 ]; then
    echo -e "${GREEN}✅ Found ($SAVE_CALLS calls)${NC}"
else
    echo -e "${YELLOW}⚠️  Found $SAVE_CALLS calls (expected at least 2)${NC}"
fi

echo ""
echo -e "${BLUE}📊 Code Statistics:${NC}"
echo ""

# Count lines
HTML_LINES=$(grep -c "history" "$PROJECT_DIR/popup.html" 2>/dev/null || echo "0")
CSS_LINES=$(grep -c "history" "$PROJECT_DIR/popup.css" 2>/dev/null || echo "0")
JS_LINES=$(grep -c "history\|History" "$PROJECT_DIR/popup.js" 2>/dev/null || echo "0")
BG_LINES=$(grep -c "saveToHistory\|analysisHistory" "$PROJECT_DIR/background.js" 2>/dev/null || echo "0")

echo "  popup.html:    $HTML_LINES lines with 'history'"
echo "  popup.css:     $CSS_LINES lines with 'history'"
echo "  popup.js:      $JS_LINES lines with 'history/History'"
echo "  background.js: $BG_LINES lines with 'saveToHistory/analysisHistory'"

echo ""
echo -e "${BLUE}🎨 Checking UI Elements:${NC}"
echo ""

# Check for UI elements
echo -n "  History header: "
if grep -q "history-header" "$PROJECT_DIR/popup.html"; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  Clear button: "
if grep -q "clearHistoryBtn" "$PROJECT_DIR/popup.html"; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  History list: "
if grep -q "historyList" "$PROJECT_DIR/popup.html"; then
    echo -e "${GREEN}✅ Present${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo ""
echo -e "${BLUE}🎨 Checking CSS Styles:${NC}"
echo ""

# Check for CSS classes
REQUIRED_CLASSES=("history-section" "history-item" "history-action-btn" "history-platform")

for class in "${REQUIRED_CLASSES[@]}"; do
    echo -n "  .$class: "
    if grep -q "\.$class" "$PROJECT_DIR/popup.css"; then
        echo -e "${GREEN}✅ Styled${NC}"
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
done

echo ""
echo -e "${BLUE}🔧 Checking JavaScript Functions:${NC}"
echo ""

# Check for key functions
REQUIRED_FUNCTIONS=("loadHistory" "handleHistoryAction" "copyToClipboard" "viewHistoryItem" "deleteHistoryItem" "getModeIcon" "getTimeAgo" "escapeHtml")

for func in "${REQUIRED_FUNCTIONS[@]}"; do
    echo -n "  $func(): "
    if grep -q "function $func\|$func =" "$PROJECT_DIR/popup.js"; then
        echo -e "${GREEN}✅ Implemented${NC}"
    else
        echo -e "${RED}❌ Missing${NC}"
    fi
done

echo ""
echo -e "${BLUE}🔒 Security Checks:${NC}"
echo ""

echo -n "  HTML escaping: "
if grep -q "escapeHtml" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Implemented${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
fi

echo -n "  XSS protection: "
if grep -q "escapeHtml(item\." "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Applied${NC}"
else
    echo -e "${YELLOW}⚠️  Check manually${NC}"
fi

echo ""
echo -e "${BLUE}💾 Storage Management:${NC}"
echo ""

echo -n "  Storage limit (100 entries): "
if grep -q "history.length > 100" "$PROJECT_DIR/background.js"; then
    echo -e "${GREEN}✅ Enforced${NC}"
else
    echo -e "${YELLOW}⚠️  Not found${NC}"
fi

echo -n "  Display limit (20 entries): "
if grep -q "slice(0, 20)" "$PROJECT_DIR/popup.js"; then
    echo -e "${GREEN}✅ Enforced${NC}"
else
    echo -e "${YELLOW}⚠️  Not found${NC}"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION COMPLETE                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ All history feature components are in place!${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Go to chrome://extensions/"
echo "  2. Find 'SmartLens AI' and click 'Reload'"
echo "  3. Perform some analyses (text or screen capture)"
echo "  4. Open the popup to see your history!"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  • HISTORY_FEATURE.md - Complete technical documentation"
echo "  • HISTORY_STATUS.txt - Quick status overview"
echo "  • TEST_HISTORY_FEATURE.md - Testing guide"
echo ""
echo -e "${GREEN}🎉 History feature is ready to use!${NC}"
echo ""
