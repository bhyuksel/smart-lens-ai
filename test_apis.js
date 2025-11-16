#!/usr/bin/env node

/**
 * SmartLens AI - Multi-Platform API Testing Script
 *
 * This script tests all supported API platforms:
 * - OpenAI (GPT-4o, GPT-4o-mini)
 * - Anthropic Claude (Claude 3.5 Sonnet)
 * - Google Gemini (Gemini 2.5 Pro, Gemini 2.5 Flash)
 * - OpenRouter (various models)
 *
 * Usage:
 *   node test_apis.js
 *
 * Or make it executable:
 *   chmod +x test_apis.js
 *   ./test_apis.js
 */

const https = require("https");
const readline = require("readline");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Test prompts
const TEXT_TEST_PROMPT = "What is 2 + 2? Answer with just the number.";
const SYSTEM_PROMPT =
  "You are a helpful AI assistant. Provide concise, accurate responses.";

// Platform configurations
const platforms = {
  openai: {
    name: "OpenAI",
    color: colors.green,
    keyPrefix: "sk-",
    keyPattern: /^sk-[A-Za-z0-9]{20,}$/,
    models: {
      text: "gpt-4o-mini",
      vision: "gpt-4o",
    },
  },
  claude: {
    name: "Anthropic Claude",
    color: colors.magenta,
    keyPrefix: "sk-ant-",
    keyPattern: /^sk-ant-[A-Za-z0-9-_]{95,}$/,
    models: {
      text: "claude-3-5-sonnet-20241022",
      vision: "claude-3-5-sonnet-20241022",
    },
  },
  gemini: {
    name: "Google Gemini",
    color: colors.blue,
    keyPrefix: "AIza",
    keyPattern: /^AIza[A-Za-z0-9_-]{35}$/,
    models: {
      text: "gemini-2.5-flash",
      vision: "gemini-2.5-pro",
    },
  },
  openrouter: {
    name: "OpenRouter",
    color: colors.cyan,
    keyPrefix: "sk-or-",
    keyPattern: /^sk-or-v1-[A-Za-z0-9]{64}$/,
    models: {
      text: "openai/gpt-4o-mini",
      vision: "openai/gpt-4o",
    },
  },
};

// Utility functions
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logHeader(message) {
  console.log();
  log(`${"=".repeat(60)}`, colors.bright);
  log(message, colors.bright);
  log(`${"=".repeat(60)}`, colors.bright);
  console.log();
}

// Validate API key format
function validateKeyFormat(platform, apiKey) {
  const config = platforms[platform];

  if (!apiKey || apiKey.trim() === "") {
    return { valid: false, error: "API key is empty" };
  }

  if (!apiKey.startsWith(config.keyPrefix)) {
    return {
      valid: false,
      error: `Key should start with '${config.keyPrefix}'`,
    };
  }

  if (!config.keyPattern.test(apiKey)) {
    return { valid: false, error: "Key format is invalid" };
  }

  return { valid: true };
}

// Make HTTP request (Promise wrapper)
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers,
          });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Test OpenAI API
async function testOpenAI(apiKey) {
  logInfo("Testing OpenAI API...");

  try {
    const options = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const body = JSON.stringify({
      model: platforms.openai.models.text,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: TEXT_TEST_PROMPT },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = await makeRequest(options, body);

    if (response.status === 200 && response.data.choices) {
      const answer = response.data.choices[0].message.content.trim();
      logSuccess(`OpenAI responded: "${answer}"`);
      logInfo(`Model: ${response.data.model}`);
      logInfo(`Tokens used: ${response.data.usage.total_tokens}`);
      return { success: true, response: answer };
    } else {
      const errorMsg =
        response.data.error?.message || JSON.stringify(response.data);
      logError(`OpenAI API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    logError(`OpenAI connection error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Claude API
async function testClaude(apiKey) {
  logInfo("Testing Anthropic Claude API...");

  try {
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    };

    const body = JSON.stringify({
      model: platforms.claude.models.text,
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: `${SYSTEM_PROMPT}\n\n${TEXT_TEST_PROMPT}`,
        },
      ],
    });

    const response = await makeRequest(options, body);

    if (response.status === 200 && response.data.content) {
      const answer = response.data.content[0].text.trim();
      logSuccess(`Claude responded: "${answer}"`);
      logInfo(`Model: ${response.data.model}`);
      logInfo(
        `Input tokens: ${response.data.usage.input_tokens}, Output tokens: ${response.data.usage.output_tokens}`
      );
      return { success: true, response: answer };
    } else {
      const errorMsg =
        response.data.error?.message || JSON.stringify(response.data);
      logError(`Claude API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    logError(`Claude connection error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test Gemini API
async function testGemini(apiKey) {
  logInfo("Testing Google Gemini API...");

  try {
    const model = platforms.gemini.models.text;
    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\n${TEXT_TEST_PROMPT}` }],
        },
      ],
    });

    const response = await makeRequest(options, body);

    if (response.status === 200 && response.data.candidates) {
      const answer = response.data.candidates[0].content.parts[0].text.trim();
      logSuccess(`Gemini responded: "${answer}"`);
      logInfo(`Model: ${model}`);
      if (response.data.usageMetadata) {
        logInfo(
          `Tokens - Prompt: ${response.data.usageMetadata.promptTokenCount}, Candidates: ${response.data.usageMetadata.candidatesTokenCount}`
        );
      }
      return { success: true, response: answer };
    } else {
      const errorMsg =
        response.data.error?.message || JSON.stringify(response.data);
      logError(`Gemini API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    logError(`Gemini connection error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test OpenRouter API
async function testOpenRouter(apiKey) {
  logInfo("Testing OpenRouter API...");

  try {
    const options = {
      hostname: "openrouter.ai",
      path: "/api/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://smartlens-ai.test",
        "X-Title": "SmartLens AI Test",
      },
    };

    const body = JSON.stringify({
      model: platforms.openrouter.models.text,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: TEXT_TEST_PROMPT },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = await makeRequest(options, body);

    if (response.status === 200 && response.data.choices) {
      const answer = response.data.choices[0].message.content.trim();
      logSuccess(`OpenRouter responded: "${answer}"`);
      logInfo(`Model: ${response.data.model}`);
      if (response.data.usage) {
        logInfo(`Tokens used: ${response.data.usage.total_tokens}`);
      }
      return { success: true, response: answer };
    } else {
      const errorMsg =
        response.data.error?.message || JSON.stringify(response.data);
      logError(`OpenRouter API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    logError(`OpenRouter connection error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test a specific platform
async function testPlatform(platform, apiKey) {
  const config = platforms[platform];

  logHeader(`Testing ${config.name}`);

  // Step 1: Validate key format
  log(`Step 1: Validating API key format...`, colors.bright);
  const validation = validateKeyFormat(platform, apiKey);

  if (!validation.valid) {
    logError(`Invalid key format: ${validation.error}`);
    return { platform, success: false, error: validation.error };
  }

  logSuccess("Key format is valid");
  console.log();

  // Step 2: Test API connection
  log(`Step 2: Testing API connection...`, colors.bright);
  console.log();

  let result;
  switch (platform) {
    case "openai":
      result = await testOpenAI(apiKey);
      break;
    case "claude":
      result = await testClaude(apiKey);
      break;
    case "gemini":
      result = await testGemini(apiKey);
      break;
    case "openrouter":
      result = await testOpenRouter(apiKey);
      break;
    default:
      return { platform, success: false, error: "Unknown platform" };
  }

  console.log();

  if (result.success) {
    log(
      `✨ ${config.name} is working correctly!`,
      colors.green + colors.bright
    );
  } else {
    log(`💥 ${config.name} test failed`, colors.red + colors.bright);
  }

  return { platform, ...result };
}

// Interactive prompt for API keys
function promptForKey(platform) {
  return new Promise((resolve) => {
    const config = platforms[platform];
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    log(`\n${config.name}`, config.color + colors.bright);
    log(`Expected format: ${config.keyPrefix}...`, colors.reset);

    rl.question(
      `Enter your ${config.name} API key (or press Enter to skip): `,
      (answer) => {
        rl.close();
        resolve(answer.trim());
      }
    );
  });
}

// Main testing function
async function main() {
  logHeader("🔬 SmartLens AI - Multi-Platform API Testing Script");

  log(
    "This script will test your API keys for all supported platforms.",
    colors.bright
  );
  log("You can skip any platform by pressing Enter without typing a key.\n");

  const results = [];

  // Test each platform
  for (const [platformKey, config] of Object.entries(platforms)) {
    const apiKey = await promptForKey(platformKey);

    if (!apiKey) {
      log(`\nSkipping ${config.name}...`, colors.yellow);
      results.push({ platform: platformKey, success: false, skipped: true });
      continue;
    }

    const result = await testPlatform(platformKey, apiKey);
    results.push(result);

    // Wait a bit between tests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  logHeader("📊 Test Summary");

  const tested = results.filter((r) => !r.skipped);
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success && !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  log(`Total platforms: ${Object.keys(platforms).length}`, colors.bright);
  log(`Tested: ${tested.length}`, colors.blue);
  log(`Successful: ${successful.length}`, colors.green);
  log(`Failed: ${failed.length}`, colors.red);
  log(`Skipped: ${skipped.length}`, colors.yellow);

  console.log();

  if (successful.length > 0) {
    log("✅ Working platforms:", colors.green + colors.bright);
    successful.forEach((r) => {
      const config = platforms[r.platform];
      log(`   • ${config.name}`, config.color);
    });
    console.log();
  }

  if (failed.length > 0) {
    log("❌ Failed platforms:", colors.red + colors.bright);
    failed.forEach((r) => {
      const config = platforms[r.platform];
      log(`   • ${config.name}: ${r.error}`, config.color);
    });
    console.log();
  }

  if (skipped.length > 0) {
    log("⏭️  Skipped platforms:", colors.yellow);
    skipped.forEach((r) => {
      const config = platforms[r.platform];
      log(`   • ${config.name}`, config.color);
    });
    console.log();
  }

  // Final recommendations
  if (failed.length > 0) {
    logHeader("💡 Troubleshooting Tips");

    failed.forEach((r) => {
      const config = platforms[r.platform];
      log(`${config.name}:`, config.color + colors.bright);

      switch (r.platform) {
        case "openai":
          log("  • Verify your key at: https://platform.openai.com/api-keys");
          log(
            "  • Check your billing: https://platform.openai.com/account/billing"
          );
          log("  • Ensure you have credits available");
          break;
        case "claude":
          log(
            "  • Verify your key at: https://console.anthropic.com/settings/keys"
          );
          log(
            "  • Check your usage: https://console.anthropic.com/settings/usage"
          );
          log("  • Ensure you have credits or are on a paid plan");
          break;
        case "gemini":
          log(
            "  • Get/verify your key at: https://makersuite.google.com/app/apikey"
          );
          log("  • Check free tier limits: 60 requests per minute");
          log("  • Ensure the API is enabled in Google Cloud Console");
          break;
        case "openrouter":
          log("  • Verify your key at: https://openrouter.ai/keys");
          log("  • Check your credits: https://openrouter.ai/credits");
          log("  • Ensure you have sufficient balance");
          break;
      }
      console.log();
    });
  }

  if (successful.length === Object.keys(platforms).length) {
    log(
      "🎉 All platforms are working! Your SmartLens AI extension is ready to use!",
      colors.green + colors.bright
    );
  } else if (successful.length > 0) {
    log(
      "✨ You can use SmartLens AI with the working platforms!",
      colors.green + colors.bright
    );
  } else if (tested.length > 0) {
    log(
      "⚠️  No platforms are currently working. Please check your API keys.",
      colors.yellow + colors.bright
    );
  }

  console.log();
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    logError(`Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  testOpenAI,
  testClaude,
  testGemini,
  testOpenRouter,
  validateKeyFormat,
  testPlatform,
};
