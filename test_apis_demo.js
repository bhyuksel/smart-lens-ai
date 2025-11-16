#!/usr/bin/env node

/**
 * SmartLens AI - API Testing Demo
 *
 * This demo shows how to use the testing functions programmatically.
 * You can use this as a template for your own testing scripts.
 */

const {
  validateKeyFormat,
  testOpenAI,
  testClaude,
  testGemini,
  testOpenRouter,
} = require("./test_apis.js");

// Demo: Validate key formats
console.log("=".repeat(60));
console.log("DEMO: Validating API Key Formats");
console.log("=".repeat(60));
console.log();

// Example keys (fake, for demonstration)
const examples = {
  openai: {
    valid: "sk-proj-abc123def456ghi789jkl012mno345pqr",
    invalid: "invalid-key",
  },
  claude: {
    valid:
      "sk-ant-api03-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890def123ghi456jkl789mno012pqr345stu678vwx901yz234abc5",
    invalid: "sk-wrong-format",
  },
  gemini: {
    valid: "AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr",
    invalid: "wrong-gemini-key",
  },
  openrouter: {
    valid:
      "sk-or-v1-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890def12",
    invalid: "sk-or-wrong",
  },
};

// Test each platform's validation
for (const [platform, keys] of Object.entries(examples)) {
  console.log(`\n${platform.toUpperCase()}`);
  console.log("-".repeat(40));

  // Test valid key
  const validResult = validateKeyFormat(platform, keys.valid);
  console.log(`Valid key:   ${validResult.valid ? "✅ PASS" : "❌ FAIL"}`);

  // Test invalid key
  const invalidResult = validateKeyFormat(platform, keys.invalid);
  console.log(`Invalid key: ${invalidResult.valid ? "❌ FAIL" : "✅ PASS"}`);
  if (invalidResult.error) {
    console.log(`  Error: ${invalidResult.error}`);
  }
}

console.log();
console.log("=".repeat(60));
console.log("DEMO COMPLETE");
console.log("=".repeat(60));
console.log();
console.log("To test with real API keys, use:");
console.log("  node test_apis.js");
console.log();
console.log("Or test programmatically:");
console.log('  const result = await testOpenAI("your-api-key-here");');
console.log("  console.log(result.success); // true or false");
console.log();

// Example of how to use async functions
console.log("Example async usage:");
console.log();
console.log("```javascript");
console.log('const { testOpenAI } = require("./test_apis.js");');
console.log("");
console.log("async function testMyKey() {");
console.log('  const apiKey = "sk-proj-your-key-here";');
console.log("  const result = await testOpenAI(apiKey);");
console.log("  ");
console.log("  if (result.success) {");
console.log('    console.log("✅ API is working!");');
console.log('    console.log("Response:", result.response);');
console.log("  } else {");
console.log('    console.log("❌ API failed:", result.error);');
console.log("  }");
console.log("}");
console.log("");
console.log("testMyKey();");
console.log("```");
console.log();
