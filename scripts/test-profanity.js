#!/usr/bin/env node

// Test script for profanity filter
const API_URL = "http://localhost:3000/api/chat/respond";

const testCases = [
  {
    name: "Clean content",
    query: "Hello, how are you today?",
    shouldPass: true,
  },
  {
    name: "Educational query",
    query: "Tell me about your education background",
    shouldPass: true,
  },
  {
    name: "Mild profanity",
    query: "This is stupid and dumb",
    shouldPass: false,
  },
  {
    name: "Strong profanity",
    query: "What the fuck is this shit?",
    shouldPass: false,
  },
  {
    name: "Leetspeak profanity",
    query: "This is f*cking terrible",
    shouldPass: false,
  },
];

async function testProfanityFilter() {
  console.log("🧪 Testing Profanity Filter\n");

  for (const testCase of testCases) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: testCase.query }),
      });

      const result = await response.json();

      if (response.status === 400 && !testCase.shouldPass) {
        console.log(`✅ ${testCase.name}: Correctly blocked profanity`);
        console.log(`   Query: "${testCase.query}"`);
        console.log(`   Response: ${result.error}`);
        if (result.moralResponse) {
          console.log(`   Moral Response: ${result.moralResponse}`);
        }
        console.log("");
      } else if (
        response.status === 200 &&
        result.type === "moral_guidance" &&
        !testCase.shouldPass
      ) {
        console.log(`✅ ${testCase.name}: Correctly provided moral guidance`);
        console.log(`   Query: "${testCase.query}"`);
        console.log(`   Warning + Quote: ${result.response}`);
        console.log("");
      } else if (response.status === 200 && testCase.shouldPass) {
        console.log(`✅ ${testCase.name}: Correctly allowed clean content`);
        console.log(`   Query: "${testCase.query}"`);
        console.log(`   Response type: ${result.type}\n`);
      } else if (response.status === 200 && !testCase.shouldPass) {
        console.log(
          `❌ ${testCase.name}: FAILED - Should have blocked profanity`
        );
        console.log(`   Query: "${testCase.query}"`);
        console.log(`   Response: ${result.response}\n`);
      } else {
        console.log(`❓ ${testCase.name}: Unexpected result`);
        console.log(`   Query: "${testCase.query}"`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(result)}\n`);
      }
    } catch (error) {
      console.log(`❌ ${testCase.name}: Network error - ${error.message}\n`);
    }
  }
}

testProfanityFilter().catch(console.error);
