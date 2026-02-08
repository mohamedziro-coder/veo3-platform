const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying Models...`);

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Found Models:");
                json.models.forEach(m => {
                    // Log if it seems related to image/vision/generation
                    if (m.name.includes("image") || m.name.includes("vision") || m.name.includes("generate") || m.supportedGenerationMethods.includes("generateImage")) {
                        console.log(`- ${m.name}`);
                        console.log(`  Methods: ${m.supportedGenerationMethods.join(", ")}`);
                    }
                });

                // Also log Gemini 2.0 to check its methods
                const g2 = json.models.find(m => m.name.includes("gemini-2.0-flash"));
                if (g2) {
                    console.log("\nGemini 2.0 Details:");
                    console.log(`- ${g2.name}`);
                    console.log(`  Methods: ${g2.supportedGenerationMethods.join(", ")}`);
                }

            } else {
                console.log("No 'models' property in response.", json);
            }
        } catch (e) {
            console.log("Error parsing JSON", e);
        }
    });
}).on("error", (err) => console.log("Error: " + err.message));
