import { Kit } from "@/lib/kit-catalog";

const RESEND_API_URL = "https://api.resend.com/emails";

type _EmailResult = {
    ok: boolean;
    error?: string;
};

const buildSkillPackEmail = (params: {
    kit: Kit;
    downloadUrl: string;
    docsUrl?: string;
    paymentId?: string;
    orderId?: string;
}) => {
    const { kit, downloadUrl, docsUrl, paymentId, orderId } = params;
    const subject = `Your ${kit.title} skill pack`;

    const lines = [
        `Thanks for your purchase of the ${kit.title}.`,
        "",
        "Download your pack:",
        downloadUrl,
        "",
        "Install steps:",
        "1) Unzip the download.",
        "2) Open the included README.md for setup details.",
        "3) Follow each skill's setup.md to configure API keys.",
    ];

    if (docsUrl) {
        lines.push("", `Install guide: ${docsUrl}`);
    }

    if (paymentId || orderId) {
        lines.push("", "Payment details:");
        if (paymentId) {
            lines.push(`Payment ID: ${paymentId}`);
        }
        if (orderId) {
            lines.push(`Order ID: ${orderId}`);
        }
    }

    lines.push("", "Need help? Reply to this email and we will take care of it.");

    const text = lines.join("\n");
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <p>Thanks for your purchase of the <strong>${kit.title}</strong>.</p>
            <p><strong>Download your pack:</strong><br/><a href="${downloadUrl}">${downloadUrl}</a></p>
            <p><strong>Install steps:</strong></p>
            <ol>
                <li>Unzip the download.</li>
                <li>Open the included README.md for setup details.</li>
                <li>Follow each skill's setup.md to configure API keys.</li>
            </ol>
            ${docsUrl ? `<p><strong>Install guide:</strong> <a href="${docsUrl}">${docsUrl}</a></p>` : ""}
            ${paymentId || orderId ? `<p><strong>Payment details:</strong><br/>
                ${paymentId ? `Payment ID: ${paymentId}<br/>` : ""}
                ${orderId ? `Order ID: ${orderId}` : ""}
            </p>` : ""}
            <p>Need help? Reply to this email and we will take care of it.</p>
        </div>
    `;

    return { subject, text, html };
};

export const sendSkillPackEmail = async (params: {
    to: string;
    kit: Kit;
    paymentId?: string;
    orderId?: string;
}) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const baseUrl = process.env.SKILL_PACK_BASE_URL;

    if (!apiKey || !from || !baseUrl) {
        return {
            ok: false,
            error: "Missing email configuration.",
        };
    }

    const sanitizedBase = baseUrl.replace(/\/$/, "");
    const downloadUrl = `${sanitizedBase}/${params.kit.downloadPath}`;
    const docsUrl = process.env.SKILL_PACK_DOCS_URL;

    const { subject, text, html } = buildSkillPackEmail({
        kit: params.kit,
        downloadUrl,
        docsUrl,
        paymentId: params.paymentId,
        orderId: params.orderId,
    });

    const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: params.to,
            subject,
            text,
            html,
            reply_to: process.env.EMAIL_REPLY_TO || undefined,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return {
            ok: false,
            error: errorText,
        };
    }

    return { ok: true };
};
