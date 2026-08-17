export interface Project {
    label: string;
    src: string;
    alt: string;
    category: string;
    title: string;
    summary: string;
    description: string;
    highlights: string[];
    accent: string; // background tint color for cinema mode
}

export const projects: Project[] = [
    {
        label: "Emissions Dashboard",
        src: "/images/case-scope3-dashboard.png",
        alt: "Scope3 carbon emissions tracking dashboard",
        category: "Sustainability SaaS",
        title: "Scope3 Global Dashboard",
        summary: "Live supplier and reporting visibility.",
        description: "Full-stack carbon accounting platform with real-time emissions tracking, supplier management, and ESRS-compliant reporting.",
        highlights: ["Real-time emissions rollups", "Supplier mix explorer", "ESRS-ready reporting exports"],
        accent: "#15283d",
    },
    {
        label: "AI Video Editor",
        src: "/images/case-reelgen.png",
        alt: "ReelGen AI-powered video generation tool",
        category: "Creative Tools",
        title: "ReelGen",
        summary: "Prompt-driven editing built for campaign teams.",
        description: "AI-powered video editor with prompt-to-clip generation, timeline editing, and style presets for marketing teams.",
        highlights: ["Prompt-to-clip generation", "Timeline fine cuts", "Brand-safe style presets"],
        accent: "#f5f0eb",
    },
    {
        label: "Sales Intelligence",
        src: "/images/case-sales-assistant.png",
        alt: "Real-time sales call assistant with live transcription",
        category: "Revenue Intelligence",
        title: "Live Call Assistant",
        summary: "Sales guidance that arrives inside the conversation.",
        description: "Real-time sales copilot with live transcription, sentiment analysis, battlecard suggestions, and smart objection handling.",
        highlights: ["Live transcript overlays", "Sentiment and objection cues", "Battlecards in-call"],
        accent: "#162d40",
    },
    {
        label: "Mobile App",
        src: "/images/case-mobile-app.png",
        alt: "Astrology and wellness mobile application",
        category: "Consumer Mobile",
        title: "Cosmic Wellness App",
        summary: "Daily rituals and readings in a guided mobile flow.",
        description: "Personalized astrology and wellness app with daily readings, muhurat timings, ritual guides, and time-travel birth chart explorer.",
        highlights: ["Daily readings and rituals", "Muhurat timing lookups", "Birth-chart time travel"],
        accent: "#2a2a48",
    },
    {
        label: "Document AI",
        src: "/images/case-smartdocs.png",
        alt: "SmartDocs PDF analysis with AI assistant",
        category: "Enterprise AI",
        title: "SmartDocs Assistant",
        summary: "Grounded PDF analysis for technical and compliance teams.",
        description: "Technical document analysis with AI-powered Q&A, compliance extraction, highlighted source citations, and export workflows.",
        highlights: ["Grounded Q&A sidecar", "Compliance field extraction", "Highlighted source citations"],
        accent: "#f8f6f3",
    },
];
