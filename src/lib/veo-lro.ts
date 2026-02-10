import { GoogleAuth } from 'google-auth-library';
import { getVertexConfigAsync } from './config';

/**
 * Helper to sanitize string for URL construction
 */
function sanitize(val: any): string {
    if (typeof val !== 'string') return '';
    const clean = val.trim().replace(/[\r\n]/g, '');
    if (clean !== val) {
        console.warn(`[VEO-LRO] Sanitized input: "${val.replace(/\n/g, '\\n')}" -> "${clean}"`);
    }
    return clean;
}

/**
 * Start Veo 3.1 video generation using REST API :predictLongRunning
 * Returns operation name for polling
 */
export async function startVideoGeneration(params: {
    prompt: string;
    startImageGcsUri: string;
    endImageGcsUri?: string;
    outputGcsUri: string;
}): Promise<{ operationName: string }> {
    try {
        const config = await getVertexConfigAsync();
        const projectId = sanitize(config.GOOGLE_PROJECT_ID || 'veo-demo');
        const location = sanitize(config.GOOGLE_LOCATION || 'us-central1');
        const model = sanitize('veo-3.1-fast-generate-001');

        const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predictLongRunning`;

        console.log(`[VEO-LRO] Starting video generation: ${url}`);

        // Validate URL before fetch
        try {
            new URL(url);
        } catch (e) {
            console.error('[VEO-LRO] INVALID URL CONSTRUCTED:', url);
            throw new Error(`Invalid Vertex API URL: ${url}`);
        }

        // Create OAuth2 client for Vertex AI
        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        if (!accessToken.token) {
            throw new Error('Failed to get access token');
        }

        const requestBody: any = {
            instances: [{
                prompt: params.prompt,
                image: {
                    gcsUri: params.startImageGcsUri,
                    mimeType: 'image/jpeg'
                }
            }],
            parameters: {
                storageUri: params.outputGcsUri,
                sampleCount: 1,
                aspectRatio: '16:9'
            }
        };

        // Add last frame if provided
        if (params.endImageGcsUri) {
            requestBody.instances[0].lastFrame = {
                gcsUri: params.endImageGcsUri,
                mimeType: 'image/jpeg'
            };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VEO-LRO] API Error (${response.status}):`, errorText);
            throw new Error(`Vertex AI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log(`[VEO-LRO] Operation started: ${data.name}`);

        return { operationName: data.name };

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to start video generation:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        throw error;
    }
}

/**
 * Poll Vertex AI operation status
 * Returns operation details including done status and result
 */
export async function pollOperationStatus(operationName: string): Promise<{
    done: boolean;
    error?: any;
    response?: any;
}> {
    try {
        const config = await getVertexConfigAsync();
        const projectId = sanitize(config.GOOGLE_PROJECT_ID);
        if (!projectId) {
            throw new Error('GOOGLE_PROJECT_ID is not configured');
        }
        let location = sanitize(config.GOOGLE_LOCATION || 'us-central1');

        // Check location in operationName
        const locMatch = operationName.match(/locations\/(.+?)\/operations/);
        if (locMatch && locMatch[1]) {
            location = sanitize(locMatch[1]);
        }

        const auth = new GoogleAuth({
            credentials: config.GOOGLE_APPLICATION_CREDENTIALS_JSON
                ? JSON.parse(config.GOOGLE_APPLICATION_CREDENTIALS_JSON)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        if (!accessToken.token) {
            throw new Error('Failed to get access token');
        }

        // Extract and sanitize Operation ID
        const rawOpId = operationName.split('/').pop() || '';
        const opId = sanitize(rawOpId);
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opId);

        console.log(`[VEO-LRO] Polling Operation ID: ${opId} (Type: ${isUuid ? 'UUID' : 'Long'}) in ${location}`);

        let pollingUrl: string;

        if (isUuid) {
            let modelId = 'veo-3.1-fast-generate-001';
            if (operationName.includes('/models/')) {
                const modelMatch = operationName.match(/\/models\/([^\/]+)/);
                if (modelMatch && modelMatch[1]) {
                    modelId = sanitize(modelMatch[1]);
                }
            }
            if (!modelId) throw new Error('Model ID could not be determined for UUID operation');

            const cleanModelId = sanitize(modelId);

            // Construct Publisher Proxy URL for UUID operations
            pollingUrl = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models/${cleanModelId}/operations/${opId}`;
        } else {
            // Use Standard Operations Endpoint for Numeric IDs
            pollingUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/operations/${opId}`;
        }

        return await executePoll(pollingUrl, accessToken.token);

    } catch (error: any) {
        console.error('[VEO-LRO] Failed to poll operation:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        throw error;
    }
}

async function executePoll(url: string, token: string) {
    console.log(`[VEO-LRO] Polling URL: ${url}`);

    // Validate URL
    try {
        new URL(url);
    } catch (e) {
        console.error('[VEO-LRO] MALFORMED POLLING URL:', url);
        throw new Error(`Invalid Polling URL: ${url}`);
    }

    // Create AbortController with 10s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[VEO-LRO] HTTP Error ${response.status}: ${errorText}`);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return {
            done: data.done || false,
            error: data.error,
            response: data.response
        };
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Polling request timed out after 10s');
        }

        if (error.message && error.message.includes('fetch failed')) {
            // ADVANCED DIAGNOSTIC: Log string details
            const hex = Array.from(url).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
            console.error(`[VEO-LRO] FETCH FAILED!`, {
                url,
                urlHex: hex,
                urlLength: url.length,
                message: error.message,
                stack: error.stack,
                cause: error.cause
            });
        }
        throw error;
    }
}
