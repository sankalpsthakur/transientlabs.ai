const MEBIBYTE = 1024 * 1024;
const SAMPLE_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_WARNING_MIB = 420;

function toMiB(bytes: number) {
  return Math.round((bytes / MEBIBYTE) * 10) / 10;
}

export function registerMemorySampler() {
  const configuredThreshold = Number.parseInt(
    process.env.MEMORY_WARNING_MIB ?? '',
    10,
  );
  const warningMiB = Number.isFinite(configuredThreshold)
    ? configuredThreshold
    : DEFAULT_WARNING_MIB;

  const sample = () => {
    const memory = process.memoryUsage();
    const payload = {
      event: 'runtime_memory',
      rssMiB: toMiB(memory.rss),
      heapUsedMiB: toMiB(memory.heapUsed),
      heapTotalMiB: toMiB(memory.heapTotal),
      externalMiB: toMiB(memory.external),
      arrayBuffersMiB: toMiB(memory.arrayBuffers),
      uptimeSeconds: Math.floor(process.uptime()),
    };

    const line = JSON.stringify(payload);
    if (payload.rssMiB >= warningMiB) {
      console.warn(line);
    } else {
      console.info(line);
    }
  };

  sample();
  const timer = setInterval(sample, SAMPLE_INTERVAL_MS);
  timer.unref();
}
