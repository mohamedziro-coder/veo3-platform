/**
 * pricing.example.ts — Realistic Usage Examples for the Pricing Engine
 *
 * Run with:  npx ts-node src/lib/pricing.example.ts
 * (or import into any test/route to validate outputs)
 *
 * These examples represent real-world client requests and show how the engine
 * produces deterministic, fully auditable price breakdowns.
 */

import { calculatePrice, unitPriceFor, PricingResult } from "./pricing";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: pretty-print a result
// ─────────────────────────────────────────────────────────────────────────────
function printResult(label: string, result: PricingResult): void {
    console.log(`\n${"═".repeat(60)}`);
    console.log(`  ${label}`);
    console.log(`${"═".repeat(60)}`);
    console.log("  Credit Breakdown:");
    console.log(`    Video        : ${result.breakdown.video_credits} credits`);
    console.log(`    Image 720p   : ${result.breakdown.image_720p_credits} credits`);
    console.log(`    Image 1080p  : ${result.breakdown.image_1080p_credits} credits`);
    console.log(`    TTS          : ${result.breakdown.tts_credits} credits`);
    console.log(`    ─────────────────────────────`);
    console.log(`    Total Credits: ${result.breakdown.total_credits} credits`);
    console.log("\n  USD Pricing:");
    console.log(`    API Cost (raw)   : $${result.total_cost_usd.toFixed(2)}`);
    console.log(`    Buffered Cost    : $${result.buffered_cost_usd.toFixed(2)} (+${(result.audit.safety_buffer_rate * 100).toFixed(0)}% buffer)`);
    console.log(`    Platform Price   : $${result.platform_price_usd.toFixed(2)}`);
    console.log(`    Profit           : $${result.profit_usd.toFixed(2)}`);
    console.log(`    Profit Margin    : ${result.profit_margin_percentage.toFixed(2)}%`);
    console.log("\n  Audit Snapshot:");
    console.log(`    Safety Buffer    : ${(result.audit.safety_buffer_rate * 100).toFixed(0)}%`);
    console.log(`    Target Margin    : ${(result.audit.profit_margin_rate * 100).toFixed(0)}%`);
    console.log(`    Credit Value     : $${result.audit.credit_value_usd} / credit`);
    console.log(`    Calculated At    : ${result.audit.calculated_at}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Example 1: Full mixed request — typical marketing agency workflow
//   • 15-second promo video
//   • 3 × 720p concept images
//   • 2 × 1080p final images
//   • 500-character voiceover narration
// ─────────────────────────────────────────────────────────────────────────────
const example1 = calculatePrice({
    video_seconds: 15,
    image_count_720p: 3,
    image_count_1080p: 2,
    tts_characters: 500,
});
printResult("Example 1 — Marketing Agency (Mixed Request)", example1);

// ─────────────────────────────────────────────────────────────────────────────
// Example 2: Audio-only batch — podcast intro / IVR system
//   • 0 video, 0 images
//   • 2 500 characters of speech (about 2 min of audio)
// ─────────────────────────────────────────────────────────────────────────────
const example2 = calculatePrice({
    tts_characters: 2500,
});
printResult("Example 2 — TTS Only (Podcast / IVR)", example2);

// ─────────────────────────────────────────────────────────────────────────────
// Example 3: High-volume image generation — e-commerce product shots
//   • 50 × 720p drafts + 20 × 1080p finals
// ─────────────────────────────────────────────────────────────────────────────
const example3 = calculatePrice({
    image_count_720p: 50,
    image_count_1080p: 20,
});
printResult("Example 3 — E-Commerce Image Batch", example3);

// ─────────────────────────────────────────────────────────────────────────────
// Example 4: Long-form video — 60-second ad campaign
// ─────────────────────────────────────────────────────────────────────────────
const example4 = calculatePrice({
    video_seconds: 60,
});
printResult("Example 4 — 60-Second Ad Campaign (Video Only)", example4);

// ─────────────────────────────────────────────────────────────────────────────
// Example 5: Custom margin — enterprise agreement at 55% margin
// ─────────────────────────────────────────────────────────────────────────────
const example5 = calculatePrice(
    {
        video_seconds: 30,
        image_count_1080p: 5,
        tts_characters: 1000,
    },
    { profitMarginRate: 0.55 }
);
printResult("Example 5 — Enterprise Tier (55% Margin Override)", example5);

// ─────────────────────────────────────────────────────────────────────────────
// Unit prices — useful for building a public pricing table
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(60)}`);
console.log("  Unit Prices (Platform-Facing, Margins Applied)");
console.log(`${"═".repeat(60)}`);
console.log(`  1 sec  of video    : $${unitPriceFor({ videoSeconds: 1 })}`);
console.log(`  1 × 720p image     : $${unitPriceFor({ image720p: 1 })}`);
console.log(`  1 × 1080p image    : $${unitPriceFor({ image1080p: 1 })}`);
console.log(`  100 TTS characters : $${unitPriceFor({ ttsCharacters: 100 })}`);
console.log(`  500 TTS characters : $${unitPriceFor({ ttsCharacters: 500 })}`);
console.log();
