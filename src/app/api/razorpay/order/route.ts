import { NextResponse } from "next/server";
import { getKitById } from "@/lib/kit-catalog";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay-server";

export async function POST(request: Request) {
    let payload: { kitId?: string };

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    if (!payload?.kitId) {
        return NextResponse.json({ error: "kitId is required." }, { status: 400 });
    }

    const kit = getKitById(payload.kitId);
    if (!kit) {
        return NextResponse.json({ error: "Unknown kit." }, { status: 400 });
    }

    const keyId = getRazorpayKeyId();
    if (!keyId) {
        return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    try {
        const order = await createRazorpayOrder({
            amount: kit.amount,
            currency: kit.currency,
            receipt: `kit_${kit.id}_${Date.now()}`,
            notes: {
                kitId: kit.id,
                kitTitle: kit.title,
            },
            payment_capture: 1,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId,
        });
    } catch (_error) {
        return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
    }
}
