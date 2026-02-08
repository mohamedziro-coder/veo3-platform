const https = require('https');
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying: ${url.replace(apiKey, "HIDDEN_KEY")}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`\nStatus Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            console.log("Response Body:");
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Response Body (Raw):", data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
