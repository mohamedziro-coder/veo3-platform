
const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Hardcoded for meaningful test
const PROJECT_ID = 'veo-demo';
const LOCATION = 'us-central1';
const MODEL_ID = 'veo-3.1-fast-generate-001';
const UUID = '550e8400-e29b-41d4-a716-446655440000';

async function testPolling() {
    console.log('--- VEO POLLING DIAGNOSTIC ---');
    console.log(`Project: ${PROJECT_ID}`);

    try {
        // Authenticate
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        const token = accessToken.token;

        if (!token) throw new Error('Could not get access token');

        // Construct URL
        const url = `https://${LOCATION}-aiplatform.googleapis.com/v1beta1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_ID}/operations/${UUID}`;
        console.log(`Testing URL: ${url}`);

        // Fetch with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal
            });
            clearTimeout(timeout);

            console.log(`Response Status: ${response.status}`);
            const text = await response.text();

            // Log success info
            const successLog = `Success! Status: ${response.status}\nBody: ${text.substring(0, 500)}`;
            fs.writeFileSync('debug_success.log', successLog);
            console.log('Success log written to debug_success.log');

        } catch (fetchError) {
            clearTimeout(timeout);
            console.error('\nFETCH FAILED CRITICALLY:');

            const errorLog = `
Timestamp: ${new Date().toISOString()}
Error Name: ${fetchError.name}
Error Message: ${fetchError.message}
Error Cause: ${JSON.stringify(fetchError.cause, null, 2)}
Error Code: ${fetchError.code}
Stack: ${fetchError.stack}
            `;
            fs.writeFileSync('debug_fetch_error.log', errorLog);
            console.log('Error log written to debug_fetch_error.log');
        }

    } catch (e) {
        console.error('Setup Error:', e);
        fs.writeFileSync('debug_setup_error.log', e.toString());
    }
}

testPolling();
