import RunwayML from '@runwayml/sdk';
import { getAppConfigAsync } from './config';

// ──────────────────────────────────────────────────────────────────────────────
// Client factory
// ──────────────────────────────────────────────────────────────────────────────
export async function getRunwayClient(): Promise<RunwayML> {
    const config = await getAppConfigAsync();
    const apiKey = config.RUNWAYML_API_SECRET || process.env.RUNWAYML_API_SECRET;
    if (!apiKey) throw new Error('RUNWAYML_API_SECRET is not configured. Add it in your .env.local or Admin Settings.');
    return new RunwayML({ apiKey });
}

// ──────────────────────────────────────────────────────────────────────────────
// Video Generation
// ──────────────────────────────────────────────────────────────────────────────
export interface VideoGenParams {
    prompt: string;
    /** base64 or https URL. If provided → image-to-video (gen4_turbo); otherwise → text-to-video (gen4.5) */
    startImage?: string;
    /** aspect ratio shorthand e.g. '9:16', '16:9', or Runway format '720:1280' */
    ratio?: string;
    /** Duration in seconds */
    duration?: number;
}

export async function startVideoGeneration(params: VideoGenParams): Promise<{ taskId: string }> {
    const client = await getRunwayClient();

    let task: { id: string };

    if (params.startImage) {
        // image-to-video: model gen4_turbo
        const ratio = normalizeRatioForGen4Turbo(params.ratio || '9:16');
        const imageUri = toImageUri(params.startImage);

        task = await client.imageToVideo.create({
            model: 'gen4_turbo',
            promptImage: imageUri,
            promptText: params.prompt || 'Cinematic video',
            ratio,
            duration: params.duration,
        });
    } else {
        // text-to-video: model gen4.5
        const ratio = normalizeRatioForGen4_5(params.ratio || '9:16');
        const duration = (params.duration && params.duration >= 2 && params.duration <= 10)
            ? params.duration
            : 8;

        task = await client.textToVideo.create({
            model: 'gen4.5',
            promptText: params.prompt,
            ratio,
            duration,
        });
    }

    console.log(`[RUNWAY] Task started: ${task.id}`);
    return { taskId: task.id };
}

// ──────────────────────────────────────────────────────────────────────────────
// Task Polling
// ──────────────────────────────────────────────────────────────────────────────
export interface RunwayTaskResult {
    done: boolean;
    status: string;
    videoUrl?: string;
    imageUrl?: string;
    audioUrl?: string;
    error?: string;
}

export async function pollRunwayTask(taskId: string): Promise<RunwayTaskResult> {
    const client = await getRunwayClient();
    const task = await client.tasks.retrieve(taskId) as any;

    console.log(`[RUNWAY] Poll task ${taskId}: status=${task.status}`);

    if (task.status === 'SUCCEEDED') {
        const output = task.output;
        let videoUrl: string | undefined;
        let imageUrl: string | undefined;
        let audioUrl: string | undefined;

        if (Array.isArray(output) && output.length > 0) {
            const url = output[0] as string;
            if (url.match(/\.(mp3|wav|ogg|aac)/i) || url.includes('audio')) {
                audioUrl = url;
            } else if (url.match(/\.(jpg|jpeg|png|webp)/i) || url.includes('image')) {
                imageUrl = url;
            } else {
                // Default to video (mp4 / runwayml CDN)
                videoUrl = url;
            }
        } else if (typeof output?.url === 'string') {
            audioUrl = output.url;
        }

        return { done: true, status: 'SUCCEEDED', videoUrl, imageUrl, audioUrl };
    }

    if (task.status === 'FAILED') {
        return { done: true, status: 'FAILED', error: task.failure || 'Generation failed' };
    }

    return { done: false, status: task.status };
}

// ──────────────────────────────────────────────────────────────────────────────
// Image Generation (gen4_image)
// ──────────────────────────────────────────────────────────────────────────────
export async function generateImage(
    prompt: string,
    referenceImageBase64?: string,
    ratio: '1024:1024' | '1360:768' | '1920:1080' | '1080:1920' | '1280:720' | '720:1280' = '1360:768'
): Promise<string> {
    const client = await getRunwayClient();

    const body: Parameters<typeof client.textToImage.create>[0] = {
        model: 'gen4_image',
        promptText: prompt,
        ratio,
        ...(referenceImageBase64 ? {
            referenceImages: [{
                uri: referenceImageBase64.startsWith('data:')
                    ? referenceImageBase64
                    : `data:image/jpeg;base64,${referenceImageBase64}`,
                tag: 'subject'
            }]
        } : {})
    };

    const task = await client.textToImage.create(body);

    // Poll until done (max 2 min)
    let attempts = 0;
    while (attempts < 60) {
        await sleep(2000);
        const taskData = await client.tasks.retrieve(task.id) as any;
        console.log(`[RUNWAY-IMG] Poll ${task.id}: ${taskData.status}`);

        if (taskData.status === 'SUCCEEDED') {
            const url = Array.isArray(taskData.output) ? taskData.output[0] : null;
            if (!url) throw new Error('No image URL in Runway response');
            return url as string;
        }
        if (taskData.status === 'FAILED') {
            throw new Error(taskData.failure || 'Image generation failed');
        }
        attempts++;
    }
    throw new Error('Image generation timed out after 2 minutes');
}

// ──────────────────────────────────────────────────────────────────────────────
// Text-to-Speech (ElevenLabs via Runway)
// ──────────────────────────────────────────────────────────────────────────────
const RUNWAY_TTS_VOICES = [
    'Maya', 'Arjun', 'Serene', 'Bernard', 'Billy', 'Mark', 'Clint', 'Mabel', 'Chad',
    'Leslie', 'Eleanor', 'Elias', 'Elliot', 'Grungle', 'Brodie', 'Sandra', 'Kirk',
    'Kylie', 'Lara', 'Lisa', 'Malachi', 'Marlene', 'Martin', 'Miriam', 'Monster',
    'Paula', 'Pip', 'Rusty', 'Ragnar', 'Xylar', 'Maggie', 'Jack', 'Katie',
    'Noah', 'James', 'Rina', 'Ella', 'Mariah', 'Frank', 'Claudia', 'Niki',
    'Vincent', 'Kendrick', 'Myrna', 'Tom', 'Wanda', 'Benjamin', 'Kiana', 'Rachel'
] as const;
export type RunwayVoice = typeof RUNWAY_TTS_VOICES[number];

export async function generateSpeech(
    text: string,
    voice: string = 'Leslie'
): Promise<{ audioUrl: string; audioBase64: string }> {
    const client = await getRunwayClient();

    const validVoice: RunwayVoice = (RUNWAY_TTS_VOICES as readonly string[]).includes(voice)
        ? (voice as RunwayVoice)
        : 'Leslie';

    const task = await client.textToSpeech.create({
        model: 'eleven_multilingual_v2',
        promptText: text.substring(0, 1000),
        voice: {
            type: 'runway-preset',
            presetId: validVoice,
        },
    });

    let attempts = 0;
    while (attempts < 60) {
        await sleep(2000);
        const result = await pollRunwayTask(task.id);
        if (result.done) {
            if (result.status === 'FAILED') throw new Error(result.error || 'TTS failed');
            if (!result.audioUrl) throw new Error('No audio URL in TTS response');
            const audioRes = await fetch(result.audioUrl);
            const audioBuffer = await audioRes.arrayBuffer();
            const audioBase64 = Buffer.from(audioBuffer).toString('base64');
            return { audioUrl: result.audioUrl, audioBase64 };
        }
        attempts++;
    }
    throw new Error('TTS generation timed out');
}

// ──────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ──────────────────────────────────────────────────────────────────────────────
function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

function toImageUri(input: string): string {
    if (input.startsWith('http')) return input;
    if (input.startsWith('data:')) return input;
    return `data:image/jpeg;base64,${input}`;
}

/** Map aspect ratio shorthand → gen4_turbo imageToVideo accepted ratios */
function normalizeRatioForGen4Turbo(input: string): '1280:720' | '720:1280' | '1104:832' | '832:1104' | '960:960' | '1584:672' {
    const map: Record<string, '1280:720' | '720:1280' | '1104:832' | '832:1104' | '960:960' | '1584:672'> = {
        '9:16': '720:1280', '16:9': '1280:720', '1:1': '960:960',
        '4:3': '1104:832', '3:4': '832:1104', '21:9': '1584:672',
        '720:1280': '720:1280', '1280:720': '1280:720', '960:960': '960:960',
        '1104:832': '1104:832', '832:1104': '832:1104', '1584:672': '1584:672',
    };
    return map[input] || '720:1280';
}

/** Map aspect ratio shorthand → gen4.5 textToVideo accepted ratios */
function normalizeRatioForGen4_5(input: string): '1280:720' | '720:1280' {
    const landscape = ['16:9', '1280:720'];
    if (landscape.includes(input)) return '1280:720';
    return '720:1280';
}
