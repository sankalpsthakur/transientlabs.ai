import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FadeIn, Stagger, StaggerItem } from "@/components/ui/Motion";
import { AnimatedBeam } from "@/components/ui/AnimatedBeam";
import {
    siNextdotjs,
    siSupabase,
    siStripe,
    siAnthropic,
    siVercel,
    siGithub,
    siX,
} from "@/lib/brand-icons";
import { kitCatalog, KitId } from "@/lib/kit-catalog";
import { loadRazorpayScript } from "@/lib/razorpay-client";
import { Loader2 } from "lucide-react";

interface KitItem {
    id: KitId;
    title: string;
    description: string;
    displayPrice: string;
    amount: number;
    currency: "USD";
    downloadPath: string;
    icon: React.ReactNode;
    features: string[];
    highlight?: boolean;
}

type SimpleIconData = {
    path: string;
};

// Helper to render simple-icon path
const SimpleIcon = ({
    icon,
    className = "w-6 h-6",
}: {
    icon: SimpleIconData | null | undefined;
    className?: string;
}) => {
    if (!icon?.path) {
        console.warn("SimpleIcon: Missing icon data", icon);
        return null;
    }
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={icon.path} />
        </svg>
    );
};

const kits: KitItem[] = [
    {
        ...kitCatalog.agency,
        icon: <SimpleIcon icon={siAnthropic} />,
        features: [
            "Content & Publishing Skills",
            "CRM & Proposal Skills",
            "Build & Test Skills",
            "Financial Snapshot Skill",
        ],
        highlight: true,
    },
    {
        ...kitCatalog.dev,
        icon: <SimpleIcon icon={siGithub} />,
        features: [
            "/pr & /review",
            "/test-gen & /docs-gen",
            "/deploy Workflow",
            "/hotfix Automation",
        ],
    },
    {
        ...kitCatalog.creator,
        icon: <SimpleIcon icon={siX} />,
        features: [
            "/transcribe & /record",
            "/repurpose Content",
            "/thread Generator",
            "/carousel Maker",
        ],
        highlight: true,
    },
    {
        ...kitCatalog.data,
        icon: <SimpleIcon icon={siSupabase} />,
        features: [
            "/query & /chart",
            "/report Generation",
            "/anomaly Detection",
            "/forecast Models",
        ],
    },
    {
        ...kitCatalog.research,
        icon: <SimpleIcon icon={siNextdotjs} />, // Placeholder icon
        features: [
            "/research & /compete",
            "/trends Analysis",
            "/summarize Docs",
            "/cite Sources",
        ],
    },
    {
        ...kitCatalog.ops,
        icon: <SimpleIcon icon={siVercel} />,
        features: [
            "/status & /logs",
            "/metrics Analysis",
            "/incident Response",
            "/postmortem Gen",
        ],
    },
];

import { Ripple } from "@/components/ui/Ripple";

function KitBeamDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-lg bg-paper p-10 md:h-[400px]"
            ref={containerRef}
        >
            <div className="flex size-full flex-col max-w-lg items-stretch justify-between gap-10 relative z-10">
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div1Ref}>
                        <SimpleIcon icon={siNextdotjs} className="h-6 w-6" />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <SimpleIcon icon={siVercel} className="h-6 w-6" />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div2Ref}>
                        <SimpleIcon icon={siSupabase} className="h-6 w-6" />
                    </Circle>
                    <div className="z-10 bg-paper p-3 rounded-xl border border-border shadow-sm relative">
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                            <Ripple mainCircleSize={200} mainCircleOpacity={0.4} numCircles={1} />
                        </div>
                        <Circle ref={div4Ref} className="size-16 border-none bg-accent/10">
                            <SimpleIcon icon={siAnthropic} className="h-8 w-8 text-accent" />
                        </Circle>
                    </div>
                    <Circle ref={div6Ref}>
                        <SimpleIcon icon={siGithub} className="h-6 w-6" />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div3Ref}>
                        <SimpleIcon icon={siStripe} className="h-6 w-6" />
                    </Circle>
                    <Circle ref={div7Ref}>
                        <SimpleIcon icon={siX} className="h-6 w-6" />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div4Ref}
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div4Ref}
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div4Ref}
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div5Ref}
                reverse
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
                reverse
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div7Ref}
                reverse
                pathWidth={4}
                pathOpacity={0.4}
                gradientStartColor="#0066ff"
                gradientStopColor="#0052cc"
            />
        </div>
    );
}

const Circle = ({ className, children, ref }: { className?: string; children?: React.ReactNode; ref?: React.Ref<HTMLDivElement> }) => {
    return (
        <div
            ref={ref}
            className={`z-10 flex size-12 items-center justify-center rounded-full border-2 border-border bg-paper p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${className}`}
        >
            {children}
        </div>
    );
};


export function Kits() {
    const [paymentState, setPaymentState] = useState<{
        kitId: KitId | null;
        status: "idle" | "loading" | "success" | "error";
        message: string;
    }>({
        kitId: null,
        status: "idle",
        message: "",
    });

    const handleBuyNow = async (kitId: KitId) => {
        const kit = kitCatalog[kitId];
        setPaymentState({
            kitId,
            status: "loading",
            message: "Opening secure checkout...",
        });

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
            setPaymentState({
                kitId,
                status: "error",
                message: "Unable to load Razorpay. Please try again.",
            });
            return;
        }

        try {
            const orderResponse = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ kitId }),
            });

            if (!orderResponse.ok) {
                setPaymentState({
                    kitId,
                    status: "error",
                    message: "Checkout failed to start. Please try again.",
                });
                return;
            }

            const order = await orderResponse.json();

            const razorpay = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Transient Labs",
                description: `${kit.title} Skill Pack`,
                order_id: order.orderId,
                notes: {
                    kitId: kit.id,
                    kitTitle: kit.title,
                },
                handler: async (response) => {
                    setPaymentState({
                        kitId,
                        status: "loading",
                        message: "Confirming payment...",
                    });

                    const verifyResponse = await fetch("/api/razorpay/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            kitId,
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        }),
                    });

                    if (!verifyResponse.ok) {
                        setPaymentState({
                            kitId,
                            status: "error",
                            message: "Payment verification failed. Please contact support.",
                        });
                        return;
                    }

                    const verification = await verifyResponse.json();
                    setPaymentState({
                        kitId,
                        status: "success",
                        message: verification.message || "Payment confirmed. Check your inbox.",
                    });
                },
                modal: {
                    ondismiss: () => {
                        setPaymentState({
                            kitId: null,
                            status: "idle",
                            message: "",
                        });
                    },
                },
            });

            razorpay.on("payment.failed", (response: unknown) => {
                const failure = response as { error?: { description?: unknown } } | null;
                setPaymentState({
                    kitId,
                    status: "error",
                    message:
                        typeof failure?.error?.description === "string"
                            ? failure.error.description
                            : "Payment failed. Please try again.",
                });
            });

            razorpay.open();
        } catch (_error) {
            setPaymentState({
                kitId,
                status: "error",
                message: "Payment setup failed. Please try again.",
            });
        }
    };

    return (
        <Section id="kits" className="bg-white border-t border-border">
            <Container>
                <div className="max-w-4xl mb-16 mx-auto text-center">
                    <FadeIn delay={0.1}>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="h-px w-8 bg-accent"></span>
                            <span className="text-sm font-mono text-accent tracking-widest uppercase">Developer Resources</span>
                            <span className="h-px w-8 bg-accent"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-6">
                            Self-Host Agents.
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2} className="mb-8">
                        <p className="text-ink-light leading-relaxed max-w-2xl mx-auto">
                            Deploy our internal tools on your own infrastructure. Claude Code Skills, MCP Connectors, and Evals for developers.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="bg-paper-warm/30 rounded-2xl border border-border p-4 mb-12">
                            <KitBeamDemo />
                        </div>
                    </FadeIn>
                </div>

                <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {kits.map((kit, idx) => (
                        <StaggerItem key={idx}>
                            <div
                                className={`group p-6 border ${kit.highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-paper'
                                    } hover:border-accent/60 transition-colors h-full flex flex-col relative overflow-hidden`}
                            >
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                                        KIT_0{idx + 1}
                                    </div>
                                    <div className={`font-mono text-sm font-bold ${kit.highlight ? 'text-accent' : 'text-ink'}`}>
                                        {kit.displayPrice}
                                    </div>
                                </div>

                                <div className="mb-6 relative h-10 w-10 text-ink-light group-hover:text-ink transition-colors z-10">
                                    {kit.icon}
                                </div>

                                <h3 className="text-xl font-semibold text-ink mb-2 relative z-10">
                                    {kit.title}
                                </h3>
                                <p className="text-sm text-ink-light mb-6 flex-grow relative z-10">
                                    {kit.description}
                                </p>

                                <div className="space-y-3 pt-6 border-t border-border/50 relative z-10">
                                    {kit.features.map((feature: string, fIdx: number) => (
                                        <div key={fIdx} className="text-xs text-ink-muted font-mono flex items-center gap-2">
                                            <span className="w-1 h-1 bg-accent/50 rounded-full"></span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 relative z-10">
                                    <Button
                                        variant={kit.highlight ? 'primary' : 'outline'}
                                        className="w-full text-xs h-10"
                                        onClick={() => handleBuyNow(kit.id)}
                                        disabled={paymentState.status === "loading"}
                                    >
                                        {paymentState.status === "loading" && paymentState.kitId === kit.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Buy Now"
                                        )}
                                    </Button>
                                    {paymentState.kitId === kit.id && paymentState.status !== "idle" && (
                                        <p
                                            className={`mt-2 text-[11px] ${paymentState.status === "error"
                                                ? "text-accent"
                                                : paymentState.status === "success"
                                                    ? "text-ink"
                                                    : "text-ink-muted"
                                                }`}
                                        >
                                            {paymentState.message}
                                        </p>
                                    )}
                                </div>

                                {kit.highlight && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none" />
                                )}
                            </div>
                        </StaggerItem>
                    ))}
                </Stagger>
            </Container>
        </Section>
    );
}
