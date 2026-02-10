
const fs = require('fs');

async function testConnectivity() {
    // Hardcoded known valid endpoint base
    // Using us-central1 and a fake project/operation to test reachability
    const url = 'https://us-central1-aiplatform.googleapis.com/v1beta1/projects/veo-test/locations/us-central1/operations/12345';

    console.log('--- NETWORK CONNECTIVITY TEST ---');
    console.log(`Target: ${url}`);

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        console.log('Attempting fetch...');
        const response = await fetch(url, {
            headers: { 'Authorization': 'Bearer verify_connectivity_only' },
            signal: controller.signal
        });
        clearTimeout(timeout);

        console.log(`Fetch succeeded with status: ${response.status}`);
        console.log(`(401/403/404 is GOOD - it means network is working)`);

    } catch (error) {
        console.error('\nFETCH FAILED CRITICALLY:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.cause) console.error('Cause:', error.cause);

        fs.writeFileSync('debug_network_error.log', `Error: ${error.message}\nCause: ${JSON.stringify(error.cause)}`);
    }
}

testConnectivity();
