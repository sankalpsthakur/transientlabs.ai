import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getGoogleScriptUrl = () =>
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

const getLeadWebhookUrl = () =>
  process.env.LEAD_WEBHOOK_URL || "";

interface LeadPayload {
  email?: unknown;
  magnetName?: unknown;
}

async function storeLeadToFile(email: string, magnetName: string) {
  try {
    const dir = join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });

    const filePath = join(dir, "leads.json");
    let leads: Array<{ email: string; magnetName: string; timestamp: string }> = [];

    try {
      const raw = await readFile(filePath, "utf-8");
      leads = JSON.parse(raw);
    } catch {
      // file doesn't exist yet — start fresh
    }

    leads.push({ email, magnetName, timestamp: new Date().toISOString() });
    await writeFile(filePath, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("[lead-magnet] Failed to write leads.json:", err);
  }
}

async function sendToWebhook(email: string, magnetName: string) {
  const webhookUrl = getLeadWebhookUrl();
  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, magnetName, timestamp: new Date().toISOString() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendToGoogleScript(email: string, magnetName: string) {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl) return false;

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "lead_magnet",
        email,
        magnetName,
        timestamp: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const DOWNLOAD_URLS: Record<string, string> = {
  "ai-mvp-playbook": "/resources/ai-mvp-playbook/full",
  "esg-checklist": "/resources/esg-checklist/full",
};

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const magnetName =
    typeof payload.magnetName === "string" ? payload.magnetName.trim() : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }
  if (!magnetName) {
    return NextResponse.json({ ok: false, error: "magnetName is required." }, { status: 400 });
  }

  // Store / deliver the lead via all configured channels (best-effort)
  await storeLeadToFile(email, magnetName);
  await sendToWebhook(email, magnetName);
  await sendToGoogleScript(email, magnetName);

  const downloadUrl =
    DOWNLOAD_URLS[magnetName.toLowerCase().replace(/\s+/g, "-")] || "#";

  return NextResponse.json({ ok: true, downloadUrl });
}
