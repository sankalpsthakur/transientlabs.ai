export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerMemorySampler } = await import('./instrumentation-node');
    registerMemorySampler();
  }
}
