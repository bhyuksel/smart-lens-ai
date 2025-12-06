# 📊 SmartLens AI - Table Scanner Feature

## Overview

The Table Scanner is a powerful feature that allows you to extract data tables from any webpage and convert them to multiple formats including JSON, CSV, TOML, and Markdown.

## Features

### 🔍 Auto-Detection

- Automatically finds all `<table>` elements on the current page
- Shows table dimensions (rows × columns)
- Displays column header preview

### 📋 Multiple Export Formats

| Format   | Extension | MIME Type        | Use Case                          |
| -------- | --------- | ---------------- | --------------------------------- |
| JSON     | .json     | application/json | APIs, JavaScript, data processing |
| CSV      | .csv      | text/csv         | Excel, Google Sheets, databases   |
| TOML     | .toml     | application/toml | Configuration files, Rust/Go apps |
| Markdown | .md       | text/markdown    | Documentation, README files       |

### 🎯 Core Functions

1. **Scan**: Detect all tables on current page
2. **Select**: Choose which table to extract (if multiple)
3. **Preview**: View formatted data with syntax highlighting
4. **Copy**: Copy to clipboard in selected format
5. **Download**: Save as file
6. **AI Analyze**: Send to AI for insights

## How to Use

### Step 1: Open Extension

Click the SmartLens AI icon in your Chrome toolbar.

### Step 2: Click Scan Table

Click the green "📊 Scan Data Table" button.

### Step 3: Handle Results

- **Single Table**: Data is extracted immediately
- **Multiple Tables**: A selector appears - click to choose one

### Step 4: Choose Format

Click one of the format buttons:

- `JSON` - Default, structured array of objects
- `CSV` - Comma-separated for spreadsheets
- `TOML` - Configuration format with [[records]]
- `Markdown` - Table syntax for documentation

### Step 5: Use the Data

- **📋 Copy**: Copies formatted data to clipboard
- **💾 Download**: Saves as file with correct extension
- **🤖 Analyze with AI**: Sends to AI for insights

## Format Examples

### Source Table

| Name  | Age | City     |
| ----- | --- | -------- |
| Alice | 30  | New York |
| Bob   | 25  | London   |

### JSON Output

```json
[
  {
    "Name": "Alice",
    "Age": 30,
    "City": "New York"
  },
  {
    "Name": "Bob",
    "Age": 25,
    "City": "London"
  }
]
```

### CSV Output

```csv
Name,Age,City
Alice,30,New York
Bob,25,London
```

### TOML Output

```toml
# Table data exported by SmartLens AI

[[records]]
name = "Alice"
age = 30
city = "New York"

[[records]]
name = "Bob"
age = 25
city = "London"
```

### Markdown Output

```markdown
| Name  | Age | City     |
| ----- | --- | -------- |
| Alice | 30  | New York |
| Bob   | 25  | London   |
```

## Technical Details

### Table Detection

The scanner looks for all `<table>` elements and extracts:

- Header row (`<th>` elements in first `<tr>`)
- Data rows (all subsequent `<tr>` elements)
- Cell content (trimmed text from `<td>` elements)

### Data Type Handling

- **Numbers**: Automatically parsed as numbers in JSON/TOML
- **Strings**: Properly escaped with quotes
- **Empty cells**: Converted to empty string or dash

### Special Character Handling

- **CSV**: Values with commas, quotes, or newlines are quoted
- **TOML**: Special characters are escaped
- **JSON**: Standard JSON escaping applied

## UI Components

### Table Section (popup.html)

```html
<div class="table-section" id="tableSection">
  <div class="table-header">
    <h3>📊 Table Scanner</h3>
    <button id="closeTableSection">✕</button>
  </div>
  <div class="table-options">
    <div class="format-buttons">
      <button class="format-btn" data-format="json">JSON</button>
      <button class="format-btn" data-format="csv">CSV</button>
      <button class="format-btn" data-format="toml">TOML</button>
      <button class="format-btn" data-format="markdown">Markdown</button>
    </div>
  </div>
  <div class="table-preview" id="tablePreview"></div>
  <div class="table-actions" id="tableActions">
    <button id="copyTableData">📋 Copy</button>
    <button id="downloadTableData">💾 Download</button>
    <button id="analyzeTableAI">🤖 Analyze with AI</button>
  </div>
</div>
```

### CSS Styling

The table scanner has a distinct green theme:

- Primary color: `#11998e` (teal)
- Secondary color: `#38ef7d` (bright green)
- Gradient: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`

### Preview Syntax Highlighting

JSON preview includes syntax highlighting:

- Keys: Light blue (`#9cdcfe`)
- Strings: Orange (`#ce9178`)
- Numbers: Light green (`#b5cea8`)
- Booleans: Blue (`#569cd6`)

## Functions Reference

### popup.js Functions

| Function                           | Description                                |
| ---------------------------------- | ------------------------------------------ |
| `scanTablesOnPage()`               | Executes in page context, finds all tables |
| `showTableSelector(tables)`        | Displays selector for multiple tables      |
| `selectTable(index)`               | Selects a specific table from the list     |
| `renderTablePreview(data, format)` | Renders preview in selected format         |
| `convertToJSON(data)`              | Converts table data to JSON string         |
| `convertToCSV(data)`               | Converts table data to CSV string          |
| `convertToTOML(data)`              | Converts table data to TOML string         |
| `convertToMarkdown(data)`          | Converts table data to Markdown table      |
| `syntaxHighlightJSON(json)`        | Adds HTML spans for syntax colors          |

### content.js Functions

| Function                  | Description                          |
| ------------------------- | ------------------------------------ |
| `startTableSelection()`   | Enables table highlight mode on page |
| `stopTableSelection()`    | Disables table highlight mode        |
| `extractTableData(table)` | Extracts data from a table element   |
| `onTableHover(e)`         | Adds highlight on mouse enter        |
| `onTableLeave(e)`         | Removes highlight on mouse leave     |
| `onTableClick(e)`         | Handles table selection click        |

## Data Structure

### Table Data Object

```javascript
{
  index: 0,           // Table index on page
  headers: ["Name", "Age", "City"],  // Column headers
  data: [             // Row data (excluding headers)
    ["Alice", "30", "New York"],
    ["Bob", "25", "London"]
  ],
  rows: 2,            // Number of data rows
  cols: 3,            // Number of columns
  preview: "Name, Age, City...",  // Header preview
  formattedOutput: "..."  // Current formatted string
}
```

## Edge Cases Handled

1. **No Tables**: Shows error message
2. **Empty Tables**: Skipped during detection
3. **No Headers**: First row used as headers
4. **Merged Cells**: Not fully supported (uses text content)
5. **Nested Tables**: Outer table preferred
6. **Dynamic Tables**: Scans current DOM state

## Keyboard Shortcuts

Currently, no keyboard shortcuts are implemented for the table scanner. Future versions may add:

- `Ctrl+Shift+T` - Start table scan
- `Escape` - Cancel selection
- `Ctrl+C` - Copy current format

## Tips & Best Practices

1. **Large Tables**: Preview shows scrollable content
2. **Complex Headers**: Multi-level headers may need manual editing
3. **Numeric Data**: Automatically parsed in JSON/TOML
4. **Special Characters**: Properly escaped in all formats
5. **AI Analysis**: Works best with structured data tables

## Troubleshooting

### No Tables Found

- Ensure the page has `<table>` elements (not CSS grids/flexbox)
- Some sites use div-based layouts that look like tables
- Dynamic tables may need page scroll to load

### Incorrect Data

- Check if table has proper `<th>` headers
- Merged cells may cause alignment issues
- Hidden columns are still extracted

### Copy Not Working

- Check clipboard permissions
- Try the download option instead
- Some browsers block clipboard in certain contexts

## Future Enhancements

Potential improvements for future versions:

- [ ] Support for CSS grid/flexbox "tables"
- [ ] Custom column selection
- [ ] Data filtering before export
- [ ] Format conversion preview comparison
- [ ] Batch export of multiple tables
- [ ] Column type detection (date, currency, etc.)
- [ ] Excel (.xlsx) export support
- [ ] SQL INSERT statement generation

## Related Documentation

- [README.md](./README.md) - Main project documentation
- [HISTORY_FEATURE.md](./HISTORY_FEATURE.md) - History feature docs
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - API configuration

---

**Feature Status**: ✅ Complete & Ready to Use
**Version Added**: 1.1.0
**Last Updated**: December 2024
