export const siteBrand = {
  concept: "the eternal transience of intelligence",
  symbol: "Long Exposure",
  track: "Precise Grotesk",
  primaryLockup: "Modular Inline",
  name: "Transient Labs",
  descriptor: "Agentic Systems and Product Studio",
  tagline: "Eternal Transience of Intelligence",
  siteUrl: "https://100xai.engineering",
  colors: {
    paper: "#F8F2E9",
    paperAlt: "#FBF7F0",
    ink: "#18120D",
    slate: "#6F5D4C",
    signalBlue: "#1F3F93",
    signalBlueReverse: "#7EA2FF",
  },
  assets: {
    lockup: {
      light: "/brand/lockup/transient-labs-lockup-light.svg",
      dark: "/brand/lockup/transient-labs-lockup-dark.svg",
      mono: "/brand/lockup/transient-labs-lockup-mono.svg",
    },
    symbol: {
      light: "/brand/symbol/transient-labs-symbol-light.svg",
      dark: "/brand/symbol/transient-labs-symbol-dark.svg",
      mono: "/brand/symbol/transient-labs-symbol-mono.svg",
    },
    wordmark: {
      light: "/brand/wordmark/transient-labs-wordmark-light.svg",
      dark: "/brand/wordmark/transient-labs-wordmark-dark.svg",
      mono: "/brand/wordmark/transient-labs-wordmark-mono.svg",
    },
    favicon: {
      ico: "/brand/favicon/favicon.ico",
      appleTouchIcon: "/brand/favicon/apple-touch-icon.png",
      icon16: "/brand/favicon/icon-16.png",
      icon32: "/brand/favicon/icon-32.png",
      icon192: "/brand/favicon/icon-192.png",
      icon512: "/brand/favicon/icon-512.png",
    },
    social: {
      ogDefault: "/brand/social/og-default.png",
      twitterDefault: "/brand/social/twitter-default.png",
    },
  },
} as const;

export type BrandLogoVariant = keyof typeof siteBrand.assets &
  ("lockup" | "symbol" | "wordmark");
export type BrandLogoTone = keyof (typeof siteBrand.assets.lockup);

const brandAssetDimensions = {
  lockup: { width: 684, height: 96 },
  symbol: { width: 84, height: 84 },
  wordmark: { width: 364, height: 40 },
} as const satisfies Record<BrandLogoVariant, { width: number; height: number }>;

export function getBrandAsset(variant: BrandLogoVariant, tone: BrandLogoTone) {
  return {
    src: siteBrand.assets[variant][tone],
    ...brandAssetDimensions[variant],
  };
}

export function getSiteAssetUrl(assetPath: string) {
  return new URL(assetPath, siteBrand.siteUrl).toString();
}

export function getBrandAssetUrl(variant: BrandLogoVariant, tone: BrandLogoTone) {
  return getSiteAssetUrl(getBrandAsset(variant, tone).src);
}
