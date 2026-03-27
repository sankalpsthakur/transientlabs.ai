import { NextResponse } from "next/server";
import { getKitById } from "@/lib/kit-catalog";
import { fetchRazorpayPayment, verifyRazorpaySignature } from "@/lib/razorpay-server";
import { sendSkillPackEmail } from "@/lib/email";
import { trackPayment } from "@/lib/payment-tracking";

export async function POST(request: Request) {
    let payload: {
        kitId?: string;
        orderId?: string;
        paymentId?: string;
        signature?: string;
    };

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const { kitId, orderId, paymentId, signature } = payload || {};

    if (!kitId || !orderId || !paymentId || !signature) {
        return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }

    const kit = getKitById(kitId);
    if (!kit) {
        return NextResponse.json({ error: "Unknown kit." }, { status: 400 });
    }

    let signatureValid = false;
    try {
        signatureValid = verifyRazorpaySignature(orderId, paymentId, signature);
    } catch {
        return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
    }

    if (!signatureValid) {
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    let payment: unknown;
    try {
        payment = await fetchRazorpayPayment(paymentId);
    } catch {
        return NextResponse.json({ error: "Unable to fetch payment status." }, { status: 500 });
    }

    const paymentObj = payment as { status?: unknown; email?: unknown; amount?: unknown; currency?: unknown } | null;
    const paymentStatus = typeof paymentObj?.status === "string" ? paymentObj.status : "unknown";
    const customerEmail = typeof paymentObj?.email === "string" ? paymentObj.email : undefined;
    const shouldDeliver = paymentStatus === "captured";

    let emailResult: { ok: boolean; error?: string } = { ok: false, error: "Skipped delivery." };
    if (shouldDeliver && customerEmail) {
        emailResult = await sendSkillPackEmail({
            to: customerEmail,
            kit,
            paymentId,
            orderId,
        });
    }

    await trackPayment({
        kitId: kit.id,
        kitTitle: kit.title,
        paymentId,
        orderId,
        status: paymentStatus,
        amount: typeof paymentObj?.amount === "number" ? paymentObj.amount : undefined,
        currency: typeof paymentObj?.currency === "string" ? paymentObj.currency : undefined,
        email: customerEmail,
    });

    const message = shouldDeliver
        ? emailResult.ok
            ? "Payment confirmed. Your skill pack is on the way."
            : "Payment confirmed. We could not email the skill pack. Please contact support."
        : "Payment received. We will email your skill pack once the payment is captured.";

    return NextResponse.json({
        ok: true,
        message,
        status: paymentStatus,
        emailSent: emailResult.ok,
    });
}
