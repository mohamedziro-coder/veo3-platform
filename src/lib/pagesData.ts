import {
    Wand2,
    Zap,
    Rocket,
    ShieldCheck,
    Layers,
    Library,
    BarChart3,
    Users,
    Target,
    Briefcase,
    HelpCircle,
    Book,
    MessageSquare,
    Globe,
    Video,
    Mic,
    Smile
} from "lucide-react";

export interface Feature {
    icon: any;
    title: string;
    description: string;
}

export interface PageContent {
    title: string;
    subtitle: string;
    features: Feature[];
    cta: string;
    visualType: 'orb' | 'cube' | 'mesh';
}

export const pagesData: Record<string, PageContent> = {
    // PRODUCTS
    "creative-studio": {
        title: "AI Creative Studio",
        subtitle: "Generate high-converting ads in seconds, not days. Defy the limits of manual production.",
        cta: "Start Creating",
        visualType: "orb",
        features: [
            { icon: Wand2, title: "Automated Scripting", description: "Our AI analyzes your hooks and angles to write scripts that sell." },
            { icon: Target, title: "Hyper-realistic Avatars", description: "Choose from 100+ lifelike avatars that represent your brand perfectly." },
            { icon: Layers, title: "One-Click Variations", description: "Generate 50+ variations of a single ad concept instantly for testing." }
        ]
    },
    "snapchat-automation": {
        title: "Snapchat Ad Automation",
        subtitle: "Scale your Snap campaigns without the manual grind. Native formats, automated wins.",
        cta: "Launch Snap Ads",
        visualType: "cube",
        features: [
            { icon: Zap, title: "Native Snap Formats", description: "Auto-generate vertical content that looks like a native Snap story." },
            { icon: BarChart3, title: "Mass Deployment", description: "Launch hundreds of ad sets across audiences in minutes." },
            { icon: ShieldCheck, title: "Built-in Optimization", description: "Our algorithms cut losers and scale winners while you sleep." }
        ]
    },
    "ugc-generator": {
        title: "AI UGC Generator",
        subtitle: "Get authentic-looking user-generated content without sending products or hiring creators.",
        cta: "Generate UGC",
        visualType: "orb",
        features: [
            { icon: Video, title: "Product URL to Video", description: "Just paste your Shopify or Amazon link and let the AI do the rest." },
            { icon: Smile, title: "Authentic Delivery", description: "Avatars that mimic real customer reactions and testimonials." },
            { icon: Rocket, title: "High-Volume Testing", description: "Test 10x more UGC hooks than your competitors." }
        ]
    },
    "talking-avatars": {
        title: "Talking AI Avatars",
        subtitle: "Put a face to your brand. Professional, lifelike presenters available 24/7 in 30+ languages.",
        cta: "Create Avatar",
        visualType: "mesh",
        features: [
            { icon: Users, title: "Diverse Library", description: "A wide range of ethnicities, ages, and styles to suit any niche." },
            { icon: Globe, title: "Multi-language Support", description: "Your avatar speaks English, Spanish, Arabic, and 27+ more." },
            { icon: MessageSquare, title: "Custom Voice Cloning", description: "Match your avatar with your own voice for a truly personal feel." }
        ]
    },
    "ai-voiceovers": {
        title: "AI Voiceover Engine",
        subtitle: "Studio-quality narration at the click of a button. Native accents, perfect tone, every time.",
        cta: "Start Recording",
        visualType: "orb",
        features: [
            { icon: Mic, title: "Neural Synthesis", description: "Human-like inflection and emotion that bypasses the 'robot' feel." },
            { icon: Library, title: "1000+ Voice Library", description: "Find the perfect persona for your brand's unique identity." },
            { icon: Wand2, title: "Instant Translation", description: "Turn one voiceover into an international campaign instantly." }
        ]
    },

    // SOLUTIONS
    "for-agencies": {
        title: "Virezo for Agencies",
        subtitle: "Onboard clients faster and deliver 10x more creatives without growing your headcount.",
        cta: "Upgrade Your Agency",
        visualType: "mesh",
        features: [
            { icon: Layers, title: "Centralized Hub", description: "Manage multiple brands and clients from a single dashboard." },
            { icon: BarChart3, title: "Performance Insights", description: "Aggregated data to show clients exactly why your AI ads work." },
            { icon: Users, title: "Team Collaboration", description: "Workflow tools for designers, buyers, and account managers." }
        ]
    },
    "for-brands": {
        title: "Virezo for Brands",
        subtitle: "Take your content production in-house. High-end quality without the agency price tag.",
        cta: "Scale Your Brand",
        visualType: "orb",
        features: [
            { icon: Rocket, title: "Consistent Identity", description: "Maintain a unified brand voice across all video platforms." },
            { icon: Target, title: "Direct-to-Consumer Focus", description: "Built specifically for high-conversion E-commerce marketing." },
            { icon: Zap, title: "Fast-to-Market", description: "Go from product concept to live ads in under an hour." }
        ]
    },
    "media-buyers": {
        title: "For Media Buyers",
        subtitle: "The weapon of choice for performance marketers. Test more, spend better, win bigger.",
        cta: "Start Winning",
        visualType: "cube",
        features: [
            { icon: Zap, title: "Iteration Master", description: "Never run out of fresh creative to feed the algorithm." },
            { icon: ShieldCheck, title: "CPA Protection", description: "Scale winning concepts horizontally across new accounts." },
            { icon: BarChart3, title: "Data-Driven Hooks", description: "AI suggests hooks based on what's currently trending in your niche." }
        ]
    },
    "creators": {
        title: "For Content Creators",
        subtitle: "Amplify your reach. Turn one idea into a multi-platform content ecosystem instantly.",
        cta: "Amplify Content",
        visualType: "orb",
        features: [
            { icon: Globe, title: "Go Global", description: "Translate your content into 30+ languages and reach new fans." },
            { icon: Zap, title: "Platform Native", description: "Auto-format for TikTok, Reels, Shorts, and more." },
            { icon: Wand2, title: "Burnout Protection", description: "Generate secondary content while you focus on your main vlogs." }
        ]
    },

    // COMPANY
    "about": {
        title: "About Virezo",
        subtitle: "We're on a mission to democratize broadcast-quality video production for everyone.",
        cta: "Join Our Journey",
        visualType: "orb",
        features: [
            { icon: Target, title: "Our Vision", description: "A world where creativity isn't limited by production budgets." },
            { icon: Rocket, title: "The Team", description: "Built by media buyers and AI researchers who know what works." },
            { icon: Globe, title: "Global Presence", description: "Supporting creators in over 100 countries across the globe." }
        ]
    },
    "mission": {
        title: "Our Mission",
        subtitle: "Empowering the next generation of digital storytellers with edge-of-the-art AI.",
        cta: "Learn More",
        visualType: "cube",
        features: [
            { icon: Zap, title: "Speed of Thought", description: "Reducing the gap between a creative idea and a live video." },
            { icon: ShieldCheck, title: "Ethical AI", description: "Leading the industry in responsible AI avatar development." },
            { icon: Users, title: "Community First", description: "Building tools that our users actually need and love." }
        ]
    },
    "careers": {
        title: "Join Virezo",
        subtitle: "Help us build the future of advertising. We're looking for world-class talent to join us.",
        cta: "View Openings",
        visualType: "mesh",
        features: [
            { icon: Briefcase, title: "Remote-First", description: "Work from anywhere in the world. We hire talent, not locations." },
            { icon: Zap, title: "High Impact", description: "Your code and designs will reach thousands of media buyers daily." },
            { icon: Smile, title: "Great Vibes", description: "A culture of innovation, speed, and genuine friendship." }
        ]
    },
    "contact": {
        title: "Get in Touch",
        subtitle: "Have questions? Our team is here to help you scale your video production.",
        cta: "Contact Support",
        visualType: "orb",
        features: [
            { icon: MessageSquare, title: "24/7 Chat", description: "Connect with our support team anytime via live chat." },
            { icon: Globe, title: "Global Sales", description: "Discuss custom enterprise solutions for your large-scale agency." },
            { icon: HelpCircle, title: "Help Center", description: "Browse our extensive library of guides and tutorials." }
        ]
    },

    // RESOURCES
    "help-center": {
        title: "Virezo Help Center",
        subtitle: "Everything you need to know about mastering the Virezo platform.",
        cta: "Browse Guides",
        visualType: "mesh",
        features: [
            { icon: Book, title: "Getting Started", description: "Step-by-step guides to launching your first AI campaign." },
            { icon: Wand2, title: "Mastering Avatars", description: "Learn how to get the most realistic delivery for your niche." },
            { icon: BarChart3, title: "Optimizing ROAS", description: "Advanced strategies for media buyers using Virezo ads." }
        ]
    },
    "glossary": {
        title: "AI Ad Glossary",
        subtitle: "The ultimate reference for modern performance marketers and AI creators.",
        cta: "Learn the Lingo",
        visualType: "cube",
        features: [
            { icon: Library, title: "100+ Definitions", description: "From 'Neural Synthesis' to 'Hook Rate'—we cover it all." },
            { icon: Zap, title: "Stay Updated", description: "Regularly updated with the latest industry terminology." },
            { icon: ShieldCheck, title: "Expert Insight", description: "Deep dives into how specific AI technologies actually work." }
        ]
    }
};
