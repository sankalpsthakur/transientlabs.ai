const DEFAULT_SITE_URL = "https://transientlabs.ai";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "55fddc4df7b4e4a17bc833eb0b25b030";

const siteUrl = new URL(process.env.SITE_URL || DEFAULT_SITE_URL);
const sourceUrl = new URL(process.env.SOURCE_URL || siteUrl);
const sitemapUrl = new URL("/sitemap.xml", sourceUrl);
const keyLocation = new URL(`/${INDEXNOW_KEY}.txt`, siteUrl);
const keyCheckUrl = new URL(`/${INDEXNOW_KEY}.txt`, sourceUrl);
const dryRun = process.argv.includes("--dry-run");

const sitemapResponse = await fetch(sitemapUrl);
if (!sitemapResponse.ok) {
  throw new Error(`Unable to fetch sitemap: ${sitemapResponse.status} ${sitemapUrl}`);
}

const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]))
  .filter((url) => url.host === siteUrl.host)
  .map((url) => url.href);

if (urlList.length === 0) {
  throw new Error(`No same-host URLs found in ${sitemapUrl}`);
}

const keyResponse = await fetch(keyCheckUrl);
if (!keyResponse.ok || (await keyResponse.text()).trim() !== INDEXNOW_KEY) {
  throw new Error(`IndexNow key is not available from ${keyCheckUrl}`);
}

const payload = {
  host: siteUrl.host,
  key: INDEXNOW_KEY,
  keyLocation: keyLocation.href,
  urlList,
};

if (dryRun) {
  console.log(JSON.stringify({ endpoint: INDEXNOW_ENDPOINT, ...payload }, null, 2));
  process.exit(0);
}

const response = await fetch(INDEXNOW_ENDPOINT, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (![200, 202].includes(response.status)) {
  const detail = await response.text();
  throw new Error(`IndexNow submission failed: ${response.status} ${detail}`);
}

console.log(
  JSON.stringify(
    {
      submitted: true,
      status: response.status,
      endpoint: INDEXNOW_ENDPOINT,
      host: siteUrl.host,
      keyLocation: keyLocation.href,
      urlCount: urlList.length,
    },
    null,
    2,
  ),
);
