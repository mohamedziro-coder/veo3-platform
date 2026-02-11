const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function checkStatus() {
    // Load config manually since we are in scripts/
    const envPath = path.join(__dirname, '..', '.env.local');
    let projectId = 'gen-lang-client-0289987536'; // Default from logs

    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/GOOGLE_PROJECT_ID=(.*)/);
        if (match) projectId = match[1].trim();
    }

    const location = 'us-central1';
    const opId = 'a8e87551-6114-46ec-a22f-a70377bb8d64'; // The one that timed out

    console.log(`Checking status for Operation ID: ${opId}`);
    console.log(`Project: ${projectId}, Location: ${location}`);

    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;

    // Try the v1beta1 Flat endpoint (likely correct for UUIDs)
    const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/operations/${opId}`;

    console.log(`Requesting: ${url}`);

    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        console.log('\n--- API RESPONSE ---');
        console.log(JSON.stringify(data, null, 2));

        if (data.error) {
            console.log('\n❌ OPERATION ERROR:', data.error);
        } else if (data.done) {
            console.log('\n✅ OPERATION COMPLETE');
            if (data.response) {
                console.log('Result:', JSON.stringify(data.response, null, 2));
            }
        } else {
            console.log('\n⏳ OPERATION STILL RUNNING');
        }

    } catch (e) {
        console.error('Request Failed:', e.message);
    }
}

checkStatus();
