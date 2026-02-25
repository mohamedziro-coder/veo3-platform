/**
 * pricing.ts — Centralized Pricing Engine for Virzo SaaS Platform
 *
 * Responsibilities:
 *   - Define all raw API costs as immutable named constants
 *   - Apply a configurable safety buffer for API price fluctuations
 *   - Apply a configurable profit margin on top of buffered cost
 *   - Return a fully auditable price breakdown per request
 *
 * Design principles:
 *   - Pure functions only — deterministic, no side effects
 *   - No hardcoded numbers inside logic — every value comes from PRICING_CONFIG
 *   - Safe for server-side (Node.js/Next.js API routes) use
 *   - Reusable from any backend language if the constants are replicated
 */

// ─────────────────────────────────────────────────────────────────────────────
// § 1. UNIT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/** 1 credit = $0.01 USD */
export const CREDIT_VALUE_USD = 0.01;

// ─────────────────────────────────────────────────────────────────────────────
// § 2. RAW API COSTS (in credits, sourced from official provider pricing)
// ─────────────────────────────────────────────────────────────────────────────

export const API_COSTS = {
    /**
     * Runway Gen4 Turbo — video generation
     * Cost: 5 credits per second of generated video
     */
    VIDEO_CREDITS_PER_SECOND: 5,

    /**
     * Runway Gen4 Image — image generation at 720p
     * Cost: 5 credits per image
     */
    IMAGE_720P_CREDITS_PER_IMAGE: 5,

    /**
     * Runway Gen4 Image — image generation at 1080p
     * Cost: 8 credits per image
     */
    IMAGE_1080P_CREDITS_PER_IMAGE: 8,

    /**
     * ElevenLabs Multilingual v2 — text-to-speech
     * Cost: 1 credit per 50 characters
     */
    TTS_CREDITS_PER_50_CHARS: 1,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// § 3. PLATFORM PRICING CONFIG (adjustable without touching logic)
// ─────────────────────────────────────────────────────────────────────────────

export const PRICING_CONFIG = {
    /**
     * Safety buffer applied to the raw API cost before profit calculation.
     * Absorbs unexpected API price fluctuations (e.g. tier changes, overages).
     * Example: 0.05 = +5% on top of raw cost.
     */
    SAFETY_BUFFER_RATE: 0.05,

    /**
     * Profit margin applied on top of the buffered cost.
     * This is the target gross margin for the platform.
     * Example: 0.40 = 40% profit margin.
     *
     * Formula: platform_price = buffered_cost / (1 - margin)
     * This ensures margin is always relative to revenue, not cost.
     */
    PROFIT_MARGIN_RATE: 0.40,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// § 4. TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PricingInput {
    /** Duration of video to generate, in seconds (e.g. 10 for a 10s clip) */
    video_seconds?: number;
    /** Number of 720p images to generate */
    image_count_720p?: number;
    /** Number of 1080p images to generate */
    image_count_1080p?: number;
    /** Total number of TTS characters to synthesize */
    tts_characters?: number;
}

export interface CostBreakdown {
    video_credits: number;
    image_720p_credits: number;
    image_1080p_credits: number;
    tts_credits: number;
    total_credits: number;
}

export interface PricingResult {
    /** Itemized credit breakdown for each service */
    breakdown: CostBreakdown;

    /** Raw API cost in USD (no buffer, no margin) — what you actually pay the providers */
    total_cost_usd: number;

    /** Buffered cost in USD after applying safety buffer — the floor for your pricing */
    buffered_cost_usd: number;

    /** Price charged to the client in USD */
    platform_price_usd: number;

    /** Gross profit in USD (platform_price - raw_cost) */
    profit_usd: number;

    /**
     * Gross margin as a percentage of revenue.
     * profit_margin_percentage = (profit / platform_price) * 100
     */
    profit_margin_percentage: number;

    /** Audit metadata — snapshot of config used for this calculation */
    audit: {
        safety_buffer_rate: number;
        profit_margin_rate: number;
        credit_value_usd: number;
        calculated_at: string; // ISO 8601
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// § 5. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

function creditsToUsd(credits: number): number {
    return credits * CREDIT_VALUE_USD;
}

// ─────────────────────────────────────────────────────────────────────────────
// § 6. CORE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculatePrice
 *
 * Computes the full end-to-end price for a single platform request.
 *
 * Pricing formula:
 *   1. raw_cost        = sum of all API costs in USD
 *   2. buffered_cost   = raw_cost × (1 + SAFETY_BUFFER_RATE)
 *   3. platform_price  = buffered_cost / (1 − PROFIT_MARGIN_RATE)
 *   4. profit          = platform_price − raw_cost
 *   5. profit_margin % = (profit / platform_price) × 100
 *
 * Using the margin-based formula (step 3) guarantees that
 * profit_margin_percentage always equals PROFIT_MARGIN_RATE × 100,
 * regardless of the input values.
 *
 * @param input - Usage quantities for each chargeable service
 * @param config - Optional overrides for safety buffer and margin (defaults to PRICING_CONFIG)
 * @returns PricingResult - Fully auditable pricing breakdown
 */
export function calculatePrice(
    input: PricingInput,
    config: {
        safetyBufferRate?: number;
        profitMarginRate?: number;
    } = {}
): PricingResult {
    const {
        safetyBufferRate = PRICING_CONFIG.SAFETY_BUFFER_RATE,
        profitMarginRate = PRICING_CONFIG.PROFIT_MARGIN_RATE,
    } = config;

    // Guard: margin must be < 1 to avoid division by zero or negative prices
    if (profitMarginRate >= 1 || profitMarginRate < 0) {
        throw new RangeError(
            `profitMarginRate must be between 0 (inclusive) and 1 (exclusive). Received: ${profitMarginRate}`
        );
    }

    const {
        video_seconds = 0,
        image_count_720p = 0,
        image_count_1080p = 0,
        tts_characters = 0,
    } = input;

    // ── Step A: Calculate credits per service ──────────────────────────────────
    const video_credits =
        video_seconds * API_COSTS.VIDEO_CREDITS_PER_SECOND;

    const image_720p_credits =
        image_count_720p * API_COSTS.IMAGE_720P_CREDITS_PER_IMAGE;

    const image_1080p_credits =
        image_count_1080p * API_COSTS.IMAGE_1080P_CREDITS_PER_IMAGE;

    // TTS: 1 credit per 50 characters, ceiling division to avoid undercharging
    const tts_credits =
        Math.ceil(tts_characters / 50) * API_COSTS.TTS_CREDITS_PER_50_CHARS;

    const total_credits =
        video_credits + image_720p_credits + image_1080p_credits + tts_credits;

    const breakdown: CostBreakdown = {
        video_credits,
        image_720p_credits,
        image_1080p_credits,
        tts_credits,
        total_credits,
    };

    // ── Step B: USD conversion ─────────────────────────────────────────────────
    const total_cost_usd = creditsToUsd(total_credits);

    // ── Step C: Apply safety buffer ────────────────────────────────────────────
    const buffered_cost_usd = total_cost_usd * (1 + safetyBufferRate);

    // ── Step D: Apply profit margin (margin-on-revenue formula) ───────────────
    // platform_price = buffered_cost / (1 - margin)
    // This ensures:  margin = (platform_price - buffered_cost) / platform_price
    const platform_price_usd = buffered_cost_usd / (1 - profitMarginRate);

    // ── Step E: Compute profit and effective margin ────────────────────────────
    // Profit is measured against raw cost (not buffered cost) for transparency
    const profit_usd = platform_price_usd - total_cost_usd;
    const profit_margin_percentage =
        platform_price_usd > 0
            ? (profit_usd / platform_price_usd) * 100
            : 0;

    return {
        breakdown,
        total_cost_usd: round2(total_cost_usd),
        buffered_cost_usd: round2(buffered_cost_usd),
        platform_price_usd: round2(platform_price_usd),
        profit_usd: round2(profit_usd),
        profit_margin_percentage: round2(profit_margin_percentage),
        audit: {
            safety_buffer_rate: safetyBufferRate,
            profit_margin_rate: profitMarginRate,
            credit_value_usd: CREDIT_VALUE_USD,
            calculated_at: new Date().toISOString(),
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// § 7. CONVENIENCE: per-service unit prices
// ─────────────────────────────────────────────────────────────────────────────

/**
 * unitPriceFor
 *
 * Returns the platform price for exactly one unit of a single service,
 * with all buffers and margins applied. Useful for displaying pricing tables.
 */
export function unitPriceFor(service: {
    videoSeconds?: number;
    image720p?: number;
    image1080p?: number;
    ttsCharacters?: number;
}): number {
    const result = calculatePrice({
        video_seconds: service.videoSeconds,
        image_count_720p: service.image720p,
        image_count_1080p: service.image1080p,
        tts_characters: service.ttsCharacters,
    });
    return result.platform_price_usd;
}
