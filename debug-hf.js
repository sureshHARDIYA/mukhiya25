// Debug script to test Hugging Face API directly
// Run this in browser console to test

async function testHuggingFaceAPI() {
  const token = "YOUR_TOKEN_HERE"; // Replace with your actual token

  const models = [
    "microsoft/DialoGPT-medium",
    "microsoft/DialoGPT-small",
    "facebook/blenderbot-400M-distill",
  ];

  for (const model of models) {
    try {
      console.log(`Testing model: ${model}`);

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: "What are your skills?",
            parameters: {
              max_new_tokens: 50,
              temperature: 0.7,
            },
          }),
        }
      );

      console.log(`${model} status:`, response.status);
      const data = await response.json();
      console.log(`${model} response:`, data);

      if (response.ok && !data.error) {
        console.log(`✅ ${model} works!`);
        break;
      }
    } catch (error) {
      console.log(`❌ ${model} failed:`, error);
    }
  }
}

// Uncomment to test:
// testHuggingFaceAPI();
