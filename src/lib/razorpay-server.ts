import crypto from "crypto";

const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";

type RazorpayCredentials = {
    keyId: string;
    keySecret: string;
};

const getRazorpayCredentials = (): RazorpayCredentials => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error("Missing Razorpay credentials.");
    }

    return { keyId, keySecret };
};

const getRazorpayAuthHeader = () => {
    const { keyId, keySecret } = getRazorpayCredentials();
    const encoded = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    return `Basic ${encoded}`;
};

export const getRazorpayKeyId = () => {
    return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
};

export type RazorpayOrderPayload = {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
    payment_capture?: 0 | 1;
};

export const createRazorpayOrder = async (payload: RazorpayOrderPayload) => {
    const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
        method: "POST",
        headers: {
            Authorization: getRazorpayAuthHeader(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Razorpay order failed: ${errorText}`);
    }

    return response.json();
};

export const fetchRazorpayPayment = async (paymentId: string) => {
    const response = await fetch(`${RAZORPAY_API_BASE}/payments/${paymentId}`, {
        method: "GET",
        headers: {
            Authorization: getRazorpayAuthHeader(),
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Razorpay payment fetch failed: ${errorText}`);
    }

    return response.json();
};

export const verifyRazorpaySignature = (
    orderId: string,
    paymentId: string,
    signature: string
) => {
    const { keySecret } = getRazorpayCredentials();
    const expected = crypto
        .createHmac("sha256", keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    return expected === signature;
};
