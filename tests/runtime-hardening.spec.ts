import { expect, test } from '@playwright/test';

test('health endpoint exposes the running service without caching', async ({ request }) => {
  const response = await request.get('/api/health');

  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('no-store');
  await expect(response.json()).resolves.toMatchObject({
    status: 'ok',
    service: 'transientlabs',
  });
});

test('forged Server Action traffic is rejected before page rendering', async ({ request }) => {
  const response = await request.post('/', {
    headers: {
      'next-action': 'not-an-action-in-this-application',
      'content-type': 'text/plain;charset=UTF-8',
    },
    data: '[]',
  });

  expect(response.status()).toBe(404);
  expect(response.headers()['cache-control']).toContain('no-store');
});

test('page routes reject write methods while API routes remain reachable', async ({ request }) => {
  const pageResponse = await request.post('/stack', { data: '{}' });
  expect(pageResponse.status()).toBe(405);
  expect(pageResponse.headers().allow).toBe('GET, HEAD, OPTIONS');

  const apiResponse = await request.post('/api/contact', { data: {} });
  expect(apiResponse.status()).not.toBe(405);
});
