const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

async function discover() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    // 1. Get Project ID from env/DB
    // We'll use the one from the user log for this script
    const projectId = 'gen-lang-client-0289987536';
    const location = 'us-central1';
    const opId = 'a8e87551-6114-46ec-a22f-a70377bb8d64';
    const modelId = 'veo-3.1-fast-generate-001';

    // 2. Auth - We must get a token. Since we are in the workspace, we try to use the credentials.
    // However, it's easier to just ask the user for a token if this fails, 
    // but let's try to find them in the filesystem.

    const auth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;

    const hostnames = [
        `${location}-aiplatform.googleapis.com`,
        `aiplatform.googleapis.com`,
        `generativelanguage.googleapis.com`
    ];

    const versions = ['v1', 'v1beta', 'v1beta1'];

    const paths = [
        `projects/${projectId}/locations/${location}/operations/${opId}`,
        `projects/${projectId}/locations/${location}/publishers/google/models/${modelId}/operations/${opId}`,
        `projects/${projectId}/operations/${opId}`,
        `operations/${opId}`
    ];

    console.log(`Searching for Op ID: ${opId}\n`);

    for (const host of hostnames) {
        for (const ver of versions) {
            for (const p of paths) {
                const url = `https://${host}/${ver}/${p}`;
                try {
                    const res = await fetch(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();

                    if (res.status === 200) {
                        console.log(`✅ [200] ${url}`);
                        console.log(JSON.stringify(data, null, 2));
                        return;
                    } else if (data.error && data.error.message.includes('must be a Long')) {
                        console.log(`❌ [LONG_REQUIRED] ${url}`);
                    } else if (res.status === 404) {
                        // console.log(`- [404] ${url}`);
                    } else {
                        console.log(`? [${res.status}] ${url} - ${data.error ? data.error.message : 'No message'}`);
                    }
                } catch (e) {
                    // console.log(`! [ERR] ${url} - ${e.message}`);
                }
            }
        }
    }
    console.log('\nFinished discovery. No 200 found.');
}

discover();
