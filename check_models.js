const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to check key
        console.log("Key seems valid. Listing models...");

        // Note: The SDK might not expose a direct listModels method in all versions.
        // We'll try to guess/check specific Veo variants if listing isn't direct.

        const potentialModels = ["veo-3.1-preview", "veo-003", "veo-video", "veo-2.0"];

        for (const modelName of potentialModels) {
            try {
                console.log(`Checking access to: ${modelName}...`);
                const m = genAI.getGenerativeModel({ model: modelName });
                // We can't easily "ping" without generating, but let's try a dry run or just assume if no error on init
                console.log(`> Model object created for ${modelName}. (Might still fail on generation)`);
            } catch (e) {
                console.log(`> Failed to init ${modelName}:`, e.message);
            }
        }

        console.log("\nIf you see 'Model object created', try using that name in route.ts");

    } catch (error) {
        console.error("Error checking check:", error);
    }
}

listModels();
