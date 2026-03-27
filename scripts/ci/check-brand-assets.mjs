import { access, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const requiredAssets = [
  'public/brand/lockup/transient-labs-lockup-light.svg',
  'public/brand/lockup/transient-labs-lockup-dark.svg',
  'public/brand/lockup/transient-labs-lockup-mono.svg',
  'public/brand/symbol/transient-labs-symbol-light.svg',
  'public/brand/symbol/transient-labs-symbol-dark.svg',
  'public/brand/symbol/transient-labs-symbol-mono.svg',
  'public/brand/wordmark/transient-labs-wordmark-light.svg',
  'public/brand/wordmark/transient-labs-wordmark-dark.svg',
  'public/brand/wordmark/transient-labs-wordmark-mono.svg',
  'public/brand/favicon/favicon.ico',
  'public/brand/favicon/apple-touch-icon.png',
  'public/brand/favicon/icon-16.png',
  'public/brand/favicon/icon-32.png',
  'public/brand/favicon/icon-192.png',
  'public/brand/favicon/icon-512.png',
  'public/brand/social/og-default.png',
  'public/brand/social/twitter-default.png',
];

const missingAssets = [];
const invalidAssets = [];

const pngDimensions = new Map([
  ['public/brand/favicon/apple-touch-icon.png', { width: 180, height: 180 }],
  ['public/brand/favicon/icon-16.png', { width: 16, height: 16 }],
  ['public/brand/favicon/icon-32.png', { width: 32, height: 32 }],
  ['public/brand/favicon/icon-192.png', { width: 192, height: 192 }],
  ['public/brand/favicon/icon-512.png', { width: 512, height: 512 }],
  ['public/brand/social/og-default.png', { width: 1200, height: 630 }],
  ['public/brand/social/twitter-default.png', { width: 1200, height: 630 }],
]);

const requiredSvgStrings = new Map([
  ['public/brand/lockup/transient-labs-lockup-light.svg', ['Transient Labs', 'Agentic Systems and Product Studio']],
  ['public/brand/lockup/transient-labs-lockup-dark.svg', ['Transient Labs', 'Agentic Systems and Product Studio']],
  ['public/brand/lockup/transient-labs-lockup-mono.svg', ['Transient Labs', 'Agentic Systems and Product Studio']],
  ['public/brand/symbol/transient-labs-symbol-light.svg', ['Long Exposure symbol', 'repeated ring states']],
  ['public/brand/symbol/transient-labs-symbol-dark.svg', ['Long Exposure symbol', 'repeated ring states']],
  ['public/brand/symbol/transient-labs-symbol-mono.svg', ['Long Exposure symbol', 'repeated ring states']],
  ['public/brand/wordmark/transient-labs-wordmark-light.svg', ['Transient Labs wordmark']],
  ['public/brand/wordmark/transient-labs-wordmark-dark.svg', ['Transient Labs wordmark']],
  ['public/brand/wordmark/transient-labs-wordmark-mono.svg', ['Transient Labs wordmark']],
]);

const svgShapeRules = new Map([
  ['public/brand/lockup/transient-labs-lockup-light.svg', { minCircles: 3, requiredColors: ['#18120D', '#1F3F93', '#6F5D4C'] }],
  ['public/brand/lockup/transient-labs-lockup-dark.svg', { minCircles: 3, requiredColors: ['#F8F2E9', '#7EA2FF', '#B89F87'] }],
  ['public/brand/lockup/transient-labs-lockup-mono.svg', { minCircles: 3, requiredColors: ['#111111', '#555555'] }],
  ['public/brand/symbol/transient-labs-symbol-light.svg', { minCircles: 3, requiredColors: ['#18120D', '#1F3F93'] }],
  ['public/brand/symbol/transient-labs-symbol-dark.svg', { minCircles: 3, requiredColors: ['#F8F2E9', '#7EA2FF'] }],
  ['public/brand/symbol/transient-labs-symbol-mono.svg', { minCircles: 3, requiredColors: ['#111111'] }],
]);

const disallowedSvgFragments = ['#E1694A', '#F2B84B', 'M42 132.1', 'M26 116.1', 'M10 100.1'];

function readPngSize(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error('not a PNG file');
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readIcoSizes(buffer) {
  if (buffer.readUInt16LE(0) !== 0 || buffer.readUInt16LE(2) !== 1) {
    throw new Error('not an ICO file');
  }

  const count = buffer.readUInt16LE(4);
  const sizes = [];

  for (let index = 0; index < count; index += 1) {
    const offset = 6 + (index * 16);
    const width = buffer.readUInt8(offset) || 256;
    const height = buffer.readUInt8(offset + 1) || 256;
    sizes.push(`${width}x${height}`);
  }

  return sizes;
}

for (const asset of requiredAssets) {
  const assetPath = path.join(rootDir, asset);

  try {
    await access(assetPath);
    const assetStat = await stat(assetPath);

    if (!assetStat.isFile()) {
      missingAssets.push(asset);
    }
  } catch {
    missingAssets.push(asset);
  }
}

for (const [asset, expected] of pngDimensions) {
  const assetPath = path.join(rootDir, asset);

  try {
    const buffer = await readFile(assetPath);
    const actual = readPngSize(buffer);

    if (actual.width !== expected.width || actual.height !== expected.height) {
      invalidAssets.push(
        `${asset} has ${actual.width}x${actual.height}, expected ${expected.width}x${expected.height}`,
      );
    }
  } catch (error) {
    invalidAssets.push(`${asset} could not be inspected: ${error.message}`);
  }
}

for (const [asset, requiredStrings] of requiredSvgStrings) {
  const assetPath = path.join(rootDir, asset);

  try {
    const source = await readFile(assetPath, 'utf8');
    for (const value of requiredStrings) {
      if (!source.includes(value)) {
        invalidAssets.push(`${asset} is missing required copy: ${value}`);
      }
    }
  } catch (error) {
    invalidAssets.push(`${asset} could not be inspected: ${error.message}`);
  }
}

for (const [asset, rule] of svgShapeRules) {
  const assetPath = path.join(rootDir, asset);

  try {
    const source = await readFile(assetPath, 'utf8');
    const circleCount = source.match(/<circle\b/g)?.length ?? 0;

    if (circleCount < rule.minCircles) {
      invalidAssets.push(`${asset} has ${circleCount} circles, expected at least ${rule.minCircles}`);
    }

    for (const color of rule.requiredColors) {
      if (!source.includes(color)) {
        invalidAssets.push(`${asset} is missing approved color ${color}`);
      }
    }

    for (const fragment of disallowedSvgFragments) {
      if (source.includes(fragment)) {
        invalidAssets.push(`${asset} still contains discarded logo fragment ${fragment}`);
      }
    }
  } catch (error) {
    invalidAssets.push(`${asset} could not be inspected: ${error.message}`);
  }
}

try {
  const faviconBuffer = await readFile(path.join(rootDir, 'public/brand/favicon/favicon.ico'));
  const faviconSizes = readIcoSizes(faviconBuffer);
  for (const requiredSize of ['16x16', '32x32']) {
    if (!faviconSizes.includes(requiredSize)) {
      invalidAssets.push(`public/brand/favicon/favicon.ico is missing ${requiredSize}`);
    }
  }
} catch (error) {
  invalidAssets.push(`public/brand/favicon/favicon.ico could not be inspected: ${error.message}`);
}

if (missingAssets.length > 0) {
  console.error('Missing required brand assets:');
  for (const asset of missingAssets) {
    console.error(`- ${asset}`);
  }
}

if (invalidAssets.length > 0) {
  console.error('Invalid brand assets:');
  for (const asset of invalidAssets) {
    console.error(`- ${asset}`);
  }
}

if (missingAssets.length > 0 || invalidAssets.length > 0) {
  process.exitCode = 1;
}
