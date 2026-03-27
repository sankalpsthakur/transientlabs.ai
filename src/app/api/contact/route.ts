import { NextResponse } from "next/server";

const RESEND_API_URL = "https://api.resend.com/emails";
const getLegacyGoogleScriptUrl = () =>
    process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

const CONTACT_EMAIL_TO = [
    "sankalphimself@gmail.com",
    "radcliffe.potter88@gmail.com",
    "admin@100xai.engineering",
];

type ContactPayload = {
    name?: string;
    email?: string;
    company?: string;
    role?: string;
    service?: string;
    industry?: string;
    brief?: string;
    docsLink?: string;
    budget?: string;
    timeline?: string;
    hasPrototype?: string;
    prototypeDetails?: string;
    alternativeContact?: string;
    honeypot?: string;
    timestamp?: string;
};

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

export async function POST(request: Request) {
    let payload: ContactPayload;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
    }

    if (payload.honeypot) {
        return NextResponse.json({ ok: true });
    }

    const name = isNonEmptyString(payload.name) ? payload.name.trim() : "";
    const email = isNonEmptyString(payload.email) ? payload.email.trim() : "";
    const service = isNonEmptyString(payload.service) ? payload.service.trim() : "";
    const brief = isNonEmptyString(payload.brief) ? payload.brief.trim() : "";

    if (!name || !email || !service || !brief) {
        return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const companyLabel = isNonEmptyString(payload.company) ? payload.company.trim() : "";
    const subject = `New lead (${service}) — ${companyLabel || name}`;

    const lines = [
        "New inbound lead",
        "",
        `Service: ${service}`,
        `Name: ${name}`,
        `Email: ${email}`,
        payload.company ? `Company: ${payload.company}` : "",
        payload.role ? `Role: ${payload.role}` : "",
        payload.industry ? `Industry: ${payload.industry}` : "",
        payload.budget ? `Budget: ${payload.budget}` : "",
        payload.timeline ? `Timeline: ${payload.timeline}` : "",
        payload.hasPrototype ? `Prototype: ${payload.hasPrototype}` : "",
        payload.prototypeDetails ? `Prototype details: ${payload.prototypeDetails}` : "",
        payload.docsLink ? `Docs link: ${payload.docsLink}` : "",
        payload.alternativeContact ? `Alternative contact: ${payload.alternativeContact}` : "",
        payload.timestamp ? `Submitted at: ${payload.timestamp}` : "",
        "",
        "Brief:",
        brief,
    ].filter(Boolean);

    const text = lines.join("\n");
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2 style="margin: 0 0 12px;">New inbound lead</h2>
            <p style="margin: 0 0 12px;">
                <strong>Service:</strong> ${service}<br/>
                <strong>Name:</strong> ${name}<br/>
                <strong>Email:</strong> ${email}<br/>
                ${payload.company ? `<strong>Company:</strong> ${payload.company}<br/>` : ""}
                ${payload.role ? `<strong>Role:</strong> ${payload.role}<br/>` : ""}
                ${payload.industry ? `<strong>Industry:</strong> ${payload.industry}<br/>` : ""}
                ${payload.budget ? `<strong>Budget:</strong> ${payload.budget}<br/>` : ""}
                ${payload.timeline ? `<strong>Timeline:</strong> ${payload.timeline}<br/>` : ""}
                ${payload.docsLink ? `<strong>Docs:</strong> <a href="${payload.docsLink}">${payload.docsLink}</a><br/>` : ""}
                ${payload.alternativeContact ? `<strong>Alt contact:</strong> ${payload.alternativeContact}<br/>` : ""}
                ${payload.timestamp ? `<strong>Submitted at:</strong> ${payload.timestamp}` : ""}
            </p>
            <p style="margin: 0;"><strong>Brief:</strong></p>
            <pre style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border: 1px solid #e5e5e5;">${brief}</pre>
        </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const resendConfigured = isNonEmptyString(apiKey) && isNonEmptyString(from);

    let resendError = "";

    if (resendConfigured) {
        const response = await fetch(RESEND_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from,
                to: CONTACT_EMAIL_TO,
                subject,
                text,
                html,
                reply_to: email,
            }),
        });

        if (response.ok) {
            return NextResponse.json({ ok: true, provider: "resend" });
        }

        resendError = await response.text().catch(() => "");
    }

    const legacyGoogleScriptUrl = getLegacyGoogleScriptUrl();

    if (legacyGoogleScriptUrl) {
        const fallbackResponse = await fetch(legacyGoogleScriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...payload,
                name,
                email,
                service,
                brief,
                timestamp: payload.timestamp || new Date().toISOString(),
            }),
        });

        if (fallbackResponse.ok) {
            return NextResponse.json({ ok: true, provider: "google-script" });
        }

        const fallbackError = await fallbackResponse.text().catch(() => "");
        return NextResponse.json(
            {
                ok: false,
                error: "Unable to send message.",
                details: fallbackError || resendError || "Contact delivery failed.",
            },
            { status: 502 }
        );
    }

    if (resendConfigured) {
        return NextResponse.json(
            {
                ok: false,
                error: "Unable to send message.",
                details: resendError || "Resend request failed.",
            },
            { status: 502 }
        );
    }

    return NextResponse.json(
        {
            ok: false,
            error: "Contact form is not configured.",
        },
        { status: 500 }
    );
}
