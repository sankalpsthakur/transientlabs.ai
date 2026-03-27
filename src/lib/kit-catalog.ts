export type KitId = "agency" | "dev" | "creator" | "data" | "research" | "ops";

export type Kit = {
    id: KitId;
    title: string;
    description: string;
    displayPrice: string;
    amount: number;
    currency: "USD";
    downloadPath: string;
};

export const kitCatalog: Record<KitId, Kit> = {
    agency: {
        id: "agency",
        title: "Agency Kit",
        description: "Full agency lifecycle. 11 skills for content, leads, deals, and delivery.",
        displayPrice: "$200",
        amount: 20000,
        currency: "USD",
        downloadPath: "agency-kit.zip",
    },
    dev: {
        id: "dev",
        title: "Dev Kit",
        description: "Ship faster. 6 skills for PRs, code reviews, testing, and deployment.",
        displayPrice: "$100",
        amount: 10000,
        currency: "USD",
        downloadPath: "dev-kit.zip",
    },
    creator: {
        id: "creator",
        title: "Creator Kit",
        description: "Content machine. 6 skills to capture, transcribe, and repurpose content.",
        displayPrice: "$100",
        amount: 10000,
        currency: "USD",
        downloadPath: "creator-kit.zip",
    },
    data: {
        id: "data",
        title: "Data Kit",
        description: "Data analyst agent. 6 skills for querying, charting, and forecasting.",
        displayPrice: "$100",
        amount: 10000,
        currency: "USD",
        downloadPath: "data-kit.zip",
    },
    research: {
        id: "research",
        title: "Research Kit",
        description: "Deep dive agent. 6 skills for search, synthesis, and competitive intel.",
        displayPrice: "$100",
        amount: 10000,
        currency: "USD",
        downloadPath: "research-kit.zip",
    },
    ops: {
        id: "ops",
        title: "Ops Kit",
        description: "Infrastructure agent. 6 skills for status checks, logs, and incident response.",
        displayPrice: "$100",
        amount: 10000,
        currency: "USD",
        downloadPath: "ops-kit.zip",
    },
};

const kitIds = Object.keys(kitCatalog) as KitId[];

export const kitList = kitIds.map((id) => kitCatalog[id]);

export const isKitId = (value: string): value is KitId => kitIds.includes(value as KitId);

export const getKitById = (value: string) => (isKitId(value) ? kitCatalog[value] : null);
