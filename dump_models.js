const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
// Using the standard list models endpoint
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying Models from: ${url.replace(apiKey, "HIDDEN_KEY")}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                fs.writeFileSync('models_list.json', JSON.stringify(json.models, null, 2));
                console.log("SUCCESS: Models saved to 'models_list.json'");
            } else {
                console.log("ERROR: No 'models' property found. Response:", JSON.stringify(json));
            }
        } catch (e) {
            console.log("ERROR Parsing JSON:", e.message);
            console.log("Raw Data Start:", data.substring(0, 100));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
