type TrackingResult = {
    ok: boolean;
    skipped?: boolean;
    error?: string;
};

export const trackPayment = async (payload: Record<string, unknown>): Promise<TrackingResult> => {
    const trackingUrl = process.env.PAYMENT_TRACKING_URL;

    if (!trackingUrl) {
        return { ok: false, skipped: true };
    }

    const response = await fetch(trackingUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return { ok: false, error: errorText };
    }

    return { ok: true };
};
