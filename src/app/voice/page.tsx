"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Play, Square, Download, Wand2, Volume2, AlertCircle } from "lucide-react";
import { COSTS, deductCredits, getUserCredits } from "@/lib/credits";

// Voice options - defined outside component to avoid recreation
// Voice options - defined outside component to avoid recreation
const VOICE_OPTIONS = [
    { id: "ar-XA-Neural2-B", name: "Moroccan Darija (Male 1)", lang: "ar-XA", type: "Neural2 (Native)" },
    { id: "ar-XA-Neural2-A", name: "Moroccan Darija (Female 1)", lang: "ar-XA", type: "Neural2 (Native)" },
    { id: "ar-XA-Neural2-C", name: "Moroccan Darija (Male 2)", lang: "ar-XA", type: "Neural2 (Deep)" },
    { id: "ar-XA-Neural2-D", name: "Moroccan Darija (Female 2)", lang: "ar-XA", type: "Neural2 (Soft)" },
    { id: "en-US-Journey-F", name: "English (Premium Female)", lang: "en-US", type: "Journey" },
    { id: "en-US-Journey-D", name: "English (Premium Male)", lang: "en-US", type: "Journey" },
    { id: "fr-FR-Neural2-A", name: "French (Female)", lang: "fr-FR", type: "Neural" },
    { id: "fr-FR-Neural2-B", name: "French (Male)", lang: "fr-FR", type: "Neural" },
];

export default function VoicePage() {
    const router = useRouter();

    // All hooks must be declared BEFORE any conditional return
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState("ar-XA-Neural2-B");
    const [speakingRate, setSpeakingRate] = useState(1.0);
    const [pitch, setPitch] = useState(0.0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentCredits = getUserCredits();
    const canAfford = currentCredits >= COSTS.VOICE;

    useEffect(() => {
        const user = localStorage.getItem('current_user');
        if (!user) {
            router.push('/login');
        } else {
            setIsPageLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => setIsPlaying(false);
        }
    }, [audioUrl]);

    // Show loading while checking auth (AFTER all hooks)
    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleGenerate = async () => {
        if (!text) return;

        if (!canAfford) {
            setError(`Insufficient credits (${currentCredits} available, ${COSTS.VOICE} required)`);
            return;
        }

        setIsLoading(true);
        setAudioUrl(null);
        setError(null);
        setIsPlaying(false);

        try {
            const response = await fetch("/api/generate-audio", {
                method: "POST",
                body: JSON.stringify({
                    text,
                    voiceId: selectedVoice,
                    languageCode: VOICE_OPTIONS.find(v => v.id === selectedVoice)?.lang || "ar-XA",
                    speakingRate,
                    pitch
                }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.success && data.audioContent) {
                // Create Blob from base64
                const audioBlob = await fetch(`data:audio/mp3;base64,${data.audioContent}`).then(r => r.blob());
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);

                deductCredits(COSTS.VOICE);

                // Log Activity
                const user = JSON.parse(localStorage.getItem('current_user') || '{}');
                const activities = JSON.parse(localStorage.getItem('mock_activity') || '[]');
                activities.unshift({
                    email: user.email,
                    name: user.name,
                    tool: "Voice",
                    timestamp: new Date().toISOString(),
                    details: `Generated voice over (${selectedVoice}): "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
                });
                localStorage.setItem('mock_activity', JSON.stringify(activities.slice(0, 50)));
            } else {
                setError(data.error || "Failed to generate audio. Ensure Text-to-Speech API is enabled.");
            }
        } catch (err) {
            setError("Network connection error.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayback = () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };


    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden pt-24 pb-32 bg-gray-50">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[150px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl z-10 flex flex-col items-center gap-8"
            >

                {/* Header */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 backdrop-blur-md text-xs font-medium text-cyan-600 shadow-sm">
                        <Volume2 className="w-3 h-3" />
                        <span>Veo Voice Studio</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900">
                        Voice Over API
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Hawel text l'sout htirafi (Professional TTS). <br />
                        <span className="text-gray-400 text-sm">Now with <b>Neural2</b> technology for 100% native-sounding Darija.</span>
                    </p>
                </motion.div>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full max-w-lg"
                        >
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                                <div>
                                    <p className="text-sm font-medium">{error}</p>
                                    {(error.includes("API Key") || error.includes("Configure")) && (
                                        <button
                                            onClick={() => router.push('/admin')}
                                            className="text-xs text-red-300 underline mt-1 hover:text-red-100"
                                        >
                                            Go to Admin Settings
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Interface */}
                <motion.div variants={itemVariants} className="w-full bg-white border border-gray-200 shadow-xl rounded-[2rem] p-1 md:p-2 relative overflow-hidden">
                    <div className="bg-white rounded-[1.8rem] overflow-hidden p-6 md:p-8 space-y-6">

                        {/* Voice Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Choose Voice Account</label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {VOICE_OPTIONS.map((voice) => (
                                    <button
                                        key={voice.id}
                                        onClick={() => setSelectedVoice(voice.id)}
                                        className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-start gap-1 min-w-[140px] border ${selectedVoice === voice.id
                                            ? "bg-primary text-white border-primary shadow-md"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span>{voice.name}</span>
                                        <span className={`text-[10px] uppercase tracking-wider ${selectedVoice === voice.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {voice.type} {voice.type.includes('Native') && '✨'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Voice Controls (Speed & Style) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                            {/* Sliders */}
                            <div className="space-y-6">
                                {/* Speed */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <label className="font-semibold text-gray-700">Speed (Zrba)</label>
                                        <span className="text-gray-500 font-mono">{speakingRate.toFixed(1)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="2.0"
                                        step="0.1"
                                        value={speakingRate}
                                        onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                                        className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase">
                                        <span>Slow</span>
                                        <span>Normal</span>
                                        <span>Fast</span>
                                    </div>
                                </div>

                                {/* Pitch */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <label className="font-semibold text-gray-700">Tone (Naghma)</label>
                                        <span className="text-gray-500 font-mono">{pitch}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-5"
                                        max="5"
                                        step="1"
                                        value={pitch}
                                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                                        className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase">
                                        <span>Deep</span>
                                        <span>Normal</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            </div>

                            {/* Style Presets */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 block">Quick Styles</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => { setSpeakingRate(1.0); setPitch(0.0); }}
                                        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-primary/50 hover:bg-blue-50/50 transition-all group"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Neutral (Tabi3i)</span>
                                        <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-primary" />
                                    </button>
                                    <button
                                        onClick={() => { setSpeakingRate(1.2); setPitch(2.0); }}
                                        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-green-400/50 hover:bg-green-50/50 transition-all group"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">Energetic (Nachat)</span>
                                        <span className="text-xs text-green-500 font-bold">⚡</span>
                                    </button>
                                    <button
                                        onClick={() => { setSpeakingRate(0.9); setPitch(-2.0); }}
                                        className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-purple-400/50 hover:bg-purple-50/50 transition-all group"
                                    >
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Serious (Ma39ol)</span>
                                        <span className="text-xs text-purple-500 font-bold">💼</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Text Input */}
                        <label className="text-sm font-semibold text-gray-700 ml-1 mb-2 block">Script</label>
                        <textarea
                            placeholder="Kteb l'script dyalk hna b'Darija... (Matalan: 'Salam, kif dayrin? Hada test dyal Veo 3.')"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-40 bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xl resize-none leading-relaxed shadow-inner"
                        />


                        {/* Controls */}
                        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                            <div className="text-xs text-gray-500 font-mono">
                                {text.length} chars
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!text || isLoading}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-white shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-5 h-5" />
                                        <span>Generate Voice ({COSTS.VOICE} Credits)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Audio Player Result */}
                <AnimatePresence>
                    {audioUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 flex items-center gap-6">
                                <button
                                    onClick={togglePlayback}
                                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-white/10"
                                >
                                    {isPlaying ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                </button>

                                <div className="flex-1 space-y-2">
                                    <div className="h-12 flex items-center gap-1 opacity-50">
                                        {/* Fake Visualizer */}
                                        {[...Array(40)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 rounded-full bg-cyan-400 transition-all duration-100 ${isPlaying ? "animate-pulse" : ""}`}
                                                style={{
                                                    height: isPlaying ? `${Math.max(20, (Math.sin(i * 0.5) + 1) * 40 + 20)}%` : "20%",
                                                    animationDelay: `${i * 0.05}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href={audioUrl}
                                    download="veo-voice.mp3"
                                    className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900"
                                >
                                    <Download className="w-5 h-5" />
                                </a>

                                <audio ref={audioRef} src={audioUrl} className="hidden" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </main>
    );
}
