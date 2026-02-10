const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function testUrls() {
    const configPath = path.join(__dirname, '..', 'src', 'data', 'config.json');
    if (!fs.existsSync(configPath)) {
        console.error('Config file not found at:', configPath);
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const projectId = config.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;
    const location = config.GOOGLE_LOCATION || process.env.GOOGLE_LOCATION || 'us-central1';
    const opId = '1e449a50-6360-4846-8a15-e9f5d3dd9b54';
    const modelId = 'veo-3.1-fast-generate-001';

    if (!projectId) { console.error('Missing Project ID'); process.exit(1); }

    const credsRaw = config.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credsRaw) { console.error('Missing Credentials'); process.exit(1); }

    let creds;
    try {
        creds = JSON.parse(credsRaw);
    } catch (e) {
        console.error('Failed to parse credentials:', e.message);
        process.exit(1);
    }

    const auth = new GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;

    const variations = [
        // 1. v1beta1 Flat Path (Common for GenAI)
        `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/operations/${opId}`, // v1beta1 Flat

        // 2. v1 Flat Path (Current - Fails with "Must be a Long")
        `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${opId}`,      // v1 Flat

        // 3. v1beta1 Nested Path (Previous - Gave 404)
        `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}/operations/${opId}`, // v1beta1 Nested

        // 4. v1 Nested Path
        `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}/operations/${opId}`      // v1 Nested
    ];

    console.log(`Testing Op ID: ${opId}\n`);

    for (const url of variations) {
        process.stdout.write(`Testing: ${url} ... `);
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log(`${res.status} ${res.statusText}`);
            if (res.status === 200) {
                console.log('✅ SUCCESS FOUND!');
                console.log(JSON.stringify(data, null, 2));
                return;
            } else {
                console.log(`❌ Error: ${data.error ? data.error.message : 'Unknown'}`);
            }
        } catch (e) {
            console.log(`💥 EXCEPTION: ${e.message}`);
        }
        console.log('---');
    }
}

testUrls();
