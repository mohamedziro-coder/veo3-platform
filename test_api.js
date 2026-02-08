const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "NOT FOUND");

    if (!apiKey) {
        console.error("ERROR: No API Key found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. Test Basic Text Generation (Flash) - To confirm Key Validity
    console.log("\n--- TEST 1: Basic Text Generation (Gemini 1.5 Flash) ---");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        console.log("SUCCESS: Gemini 1.5 Flash is working.");
    } catch (error) {
        console.error("FAIL: Gemini 1.5 Flash failed.");
        console.error("Error:", error.message);
        // If this fails, the key is bad/expired.
        return;
    }

    // 2. Test Veo Model Access (Multiple Variants)
    const veoModels = ["veo-3.1-preview", "veo-003", "veo-2.0"]; // Common/Previous names

    console.log("\n--- TEST 2: Checking Veo Model Access ---");

    for (const modelName of veoModels) {
        console.log(`\nChecking model: ${modelName}...`);
        try {
            const videoModel = genAI.getGenerativeModel({ model: modelName });

            // Dry run: Try to generate content with text only. 
            // We EXPECT an error (invalid argument), but we check specifically for 403/404/PermissionDenied.

            try {
                await videoModel.generateContent("Test video prompt");
                console.log(`>>> POSSIBLE SUCCESS: ${modelName} did not throw an Auth error (it might have worked or failed on validation).`);
            } catch (innerError) {
                const msg = innerError.message;
                if (msg.includes("404") || msg.includes("not found")) {
                    console.log(`>>> ${modelName}: Not Found (404)`);
                } else if (msg.includes("403") || msg.includes("permission") || msg.includes("API key not valid")) {
                    console.log(`>>> ${modelName}: Permission Denied (403)`);
                } else {
                    console.log(`>>> ${modelName}: ACCESSIBLE! (Error was: ${msg.substring(0, 50)}...)`);
                    console.log(`   (This 'invalid argument' error means the model EXISTS and ACCEPTED the key, but rejected the text-only input. This is GOOD.)`);
                }
            }
        } catch (error) {
            console.error(`Error initializing ${modelName}:`, error.message);
        }
    }
}

testKey();
