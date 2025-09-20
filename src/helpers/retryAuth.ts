export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const retryWithBackoff = async (fn: () => Promise<any>, attempts = 5, baseMs = 500): Promise<any> => {
  let lastErr: any;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const backoff = Math.min(baseMs * 2 ** (i - 1), 30000);
      const jitter = Math.round(backoff * (0.3 * (Math.random() - 0.5)));
      const wait = Math.max(100, backoff + jitter);
      console.warn(`DB auth attempt ${i}/${attempts} failed. Retrying in ${wait}ms. err=${err.message}`);
      await sleep(wait);
    }
  }
  throw lastErr;
};